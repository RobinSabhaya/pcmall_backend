const httpStatus = require('http-status');
const { createShipment, buyLabel, trackShipment } = require('../../services/shipping/carriers/shippo');
const shippingService = require('../../services/shipping/shipping.service');
const userService = require('../../services/user/user.service');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { SHIPMENT_TYPE, USER_ROLE } = require('../../helpers/constant.helper');
const { generateAddressForShipping } = require('../../helpers/function.helper');

// Create a shipment, buy label, and save to DB
const createShipping = catchAsync(async (req, res) => {
  try {
    const { parcel } = req.body;
    const { _id } = req.user;

    const userData = await userService.getFilterUser({ _id });
    const userAddressData = await userService.getAddress({ user: _id, isPrimary: true }).lean();

    const adminData = await userService.getFilterUser({ roles: { $in: [USER_ROLE.SUPER_ADMIN] } });
    const adminAddressData = await userService.getAddress({ user: adminData._id.toString(), isPrimary: true }).lean();

    // Create shipment
    const shippoShipment = await createShipment(
      generateAddressForShipping({ phone: userData.phone_number, email: userData.email, ...userAddressData }),
      generateAddressForShipping({ phone: adminData.phone_number, email: adminData.email, ...adminAddressData }),
      parcel
    );

    // Priority to select USPS
    // const selectedRate = rates.sort((a, b) => +a.amount - +b.amount).find((rate) => rate.provider === 'USPS');

    // const label = await buyLabel(selectedRate?.objectId || rates[0]?.objectId);

    const payload = {
      shippoShipmentId: shippoShipment.objectId,
      fromAddress: shippoShipment.addressFrom,
      toAddress: shippoShipment.addressTo,
      parcel,
      rates: shippoShipment.rates,
      // selectedRate: selectedRate,
      shipmentType: SHIPMENT_TYPE.OUTGOING,
      isReturn: false,
    };

    const shipment = await shippingService.createAndUpdateShipping(payload, payload, {
      new: true,
      upsert: true,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      data: {
        shipment,
        rates: shippoShipment.rates,
      },
      message: 'Shipping created successfully!',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

/** Buy label */
const generateBuyLabel = catchAsync(async (req, res) => {
  try {
    const { shippoShipmentId, selectedRate } = req.body;

    let shipment = await shippingService.getShipping({
      shippoShipmentId,
    });

    if (!shipment) throw new ApiError(httpStatus.NOT_FOUND, 'Shipping not valid.');

    /** Create label */
    const label = await buyLabel(selectedRate?.objectId);

    const payload = {
      label: {
        labelUrl: label.labelUrl,
        labelType: label.labelFileType,
        trackingNumber: label.trackingNumber,
        carrier: label.trackingUrlProvider,
        transactionId: label.objectId,
      },
      trackingStatus: {
        status: label.status,
        statusDetails: '',
        statusDate: new Date(),
      },
      trackingHistory: [
        {
          status: label.status,
          statusDetails: '',
          statusDate: new Date(),
        },
      ],
      status: label.trackingStatus || 'UNKNOWN',
    };

    shipment = await shippingService.createAndUpdateShipping({ shippoShipmentId: shipment.shippoShipmentId }, payload, {
      new: true,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      data: {
        shipment,
        label,
      },
      message: 'Label generated successfully',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

// Manual tracking
const track = catchAsync(async (req, res) => {
  try {
    const { carrier, trackingNumber, tracking_number } = req.body;
    let tracking;

    if (tracking_number) {
      let tracking = await shippingService.getShipping({ 'label.trackingNumber': tracking_number });
      if (!tracking) throw new ApiError(httpStatus.NOT_FOUND, 'Shipping not found');
    }

    tracking = await trackShipment(carrier, trackingNumber);

    // Optional: update DB with fresh status
    tracking = await shippingService.createAndUpdateShipping(
      { 'label.trackingNumber': tracking_number },
      {
        trackingHistory: tracking?.trackingHistory,
        trackingStatus: tracking?.trackingStatus,
        metadata: tracking?.metadata,
      },
      {
        new: true,
      }
    );

    return res.status(httpStatus.OK).json({
      success: true,
      data: tracking,
      message: 'Shipping update successfully!',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  createShipping,
  track,
  generateBuyLabel,
};
