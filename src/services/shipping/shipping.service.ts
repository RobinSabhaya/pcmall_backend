import httpStatus from 'http-status';
import { ParcelCreateRequest, Shipment } from 'shippo';

import { config } from '@/config/config';
import { SHIPMENTTYPE, USERROLE } from '@/helpers/constant.helper';
import { generateAddressForShipping } from '@/helpers/function.helper';
import { findOneAndUpdateDoc, findOneDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IAddress, IUser } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';
import {
  CreateAndUpdateShippingSchema,
  GenerateBuyLabelSchema,
  TrackSchema,
} from '@/validations/shipping.validation';

import { IShipment } from '../../models/shipment';

import { handleShipping } from './shippingStrategy';

const {
  shipping: { shippingCarrier },
} = config;

interface IOptions {
  user?: IUser;
}

/**
 * Create and Update Shipment
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Shipment>}
 */
export const createAndUpdateShipping = async (
  reqBody: CreateAndUpdateShippingSchema,
  options?: IOptions
): Promise<{
  shipment: IShipment | null;
  shippoShipment: Shipment;
}> => {
  const { parcel } = reqBody;
  const user = options?.user;
  const userData = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
    _id: user?._id,
  });
  const userAddressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS, {
    user: user?._id,
    isPrimary: true,
  });

  const adminData = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
    roles: { $in: [USERROLE.SUPER_ADMIN] },
  });
  const adminAddressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS, {
    user: adminData?._id,
    isPrimary: true,
  });

  // Create shipment
  const shippoShipment = await handleShipping(shippingCarrier!).createShipment(
    generateAddressForShipping({
      phone: userData?.phone_number,
      email: userData?.email,
      ...JSON.parse(JSON.stringify(userAddressData)),
    }),
    generateAddressForShipping({
      phone: adminData?.phone_number,
      email: adminData?.email,
      ...JSON.parse(JSON.stringify(adminAddressData)),
    }),
    parcel as ParcelCreateRequest
  );

  const payload = {
    shippoShipmentId: shippoShipment.objectId,
    fromAddress: shippoShipment.addressFrom,
    toAddress: shippoShipment.addressTo,
    parcel,
    rates: shippoShipment.rates,
    // selectedRate: selectedRate,
    shipmentType: SHIPMENTTYPE.OUTGOING,
    isReturn: false,
  };

  const shipment = await findOneAndUpdateDoc<IShipment>(
    MONGOOSE_MODELS.SHIPMENT,
    payload,
    payload,
    {
      upsert: true,
      new: true,
    }
  );
  return {
    shipment,
    shippoShipment,
  };
};

export const generateBuyLabel = async (
  reqBody: GenerateBuyLabelSchema
): Promise<{
  shipment: IShipment | null;
  label: unknown;
}> => {
  const { shippoShipmentId, rateObjectId } = reqBody;

  let shipment = await findOneDoc<IShipment>(MONGOOSE_MODELS.SHIPMENT, {
    shippoShipmentId,
  });

  if (!shipment)
    throw new ApiError(httpStatus.NOT_FOUND, 'Shipping not valid.');

  /** Create label */
  const label = await handleShipping(shippingCarrier!).buyLabel(rateObjectId);

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
    status: label.trackingStatus ?? 'UNKNOWN',
  };

  shipment = await findOneAndUpdateDoc<IShipment>(
    MONGOOSE_MODELS.SHIPMENT,
    { shippoShipmentId: shipment.shippoShipmentId },
    payload,
    {
      new: true,
    }
  );

  if (shipment === null || label === null)
    console.error('Shipment and Label has been fail');

  return {
    shipment,
    label,
  };
};

export const track = async (
  reqBody: TrackSchema
): Promise<{
  tracking: IShipment | null;
}> => {
  const { carrier, trackingNumber, tracking_number } = reqBody;
  let tracking;

  if (tracking_number) {
    const tracking = await findOneDoc<IShipment>(MONGOOSE_MODELS.SHIPMENT, {
      'label.trackingNumber': tracking_number,
    });
    if (!tracking)
      throw new ApiError(httpStatus.NOT_FOUND, 'Shipping not found');
  }

  tracking = await handleShipping(shippingCarrier!).trackShipment(
    carrier,
    trackingNumber
  );

  // Optional: update DB with fresh status
  tracking = await findOneAndUpdateDoc<IShipment>(
    MONGOOSE_MODELS.SHIPMENT,
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

  return {
    tracking,
  };
};
