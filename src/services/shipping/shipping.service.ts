import { findOneAndUpdateDoc, findOneDoc } from '@/helpers/mongoose.helper';
import { IShipment } from '../../models/shipment';
import { IAddress, IUser } from '@/models/user';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { SHIPMENT_TYPE, USER_ROLE } from '@/helpers/constant.helper';
import { generateAddressForShipping } from '@/helpers/function.helper';
import { handleShipping } from './shippingStrategy';
import { config } from '@/config/config';
import { CreateAndUpdateShippingSchema, GenerateBuyLabelSchema, TrackSchema } from '@/validations/shipping.validation';
import ApiError from '@/utils/ApiError';
import httpStatus from 'http-status'
const { shipping:{shippingCarrier}} = config

interface IOptions { 
  user?:IUser
}

/**
 * Create and Update Shipment
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Shipment>}
 */
export const createAndUpdateShipping = async (reqBody: CreateAndUpdateShippingSchema, options?: IOptions): Promise<
  {
    shipment: IShipment | null;
    shippoShipment: unknown;
  }> => {
  const { parcel } = reqBody;
  const user = options?.user
  const userData = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { _id: user?._id });
    const userAddressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS,{ user: user?._id, isPrimary: true })

    const adminData = await findOneDoc<IUser>(MONGOOSE_MODELS.USER,{ roles: { $in: [USER_ROLE.SUPER_ADMIN] } });
    const adminAddressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS,{ user: adminData?._id, isPrimary: true })

    // Create shipment
    const shippoShipment = await handleShipping(shippingCarrier!).createShipment(
      generateAddressForShipping({ phone: userData?.phone_number, email: userData?.email, ...JSON.parse(JSON.stringify(userAddressData)) }),
      generateAddressForShipping({ phone: adminData?.phone_number, email: adminData?.email, ...JSON.parse(JSON.stringify(adminAddressData)) }),
      parcel
    );

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

  const shipment = await findOneAndUpdateDoc<IShipment>(MONGOOSE_MODELS.SHIPMENT, payload, payload, {
    upsert: true,
    new : true
  });
  return {
    shipment,
    shippoShipment
  }
};

export const generateBuyLabel = async (reqBody: GenerateBuyLabelSchema): Promise<{
  shipment: IShipment | null;
  label: unknown;
}> => {
  const { shippoShipmentId, rateObjectId } = reqBody
  
      let shipment = await findOneDoc<IShipment>(MONGOOSE_MODELS.SHIPMENT,{
        shippoShipmentId,
      });
  
      if (!shipment) throw new ApiError(httpStatus.NOT_FOUND, 'Shipping not valid.');
  
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
        status: label.trackingStatus || 'UNKNOWN',
      };
  
      shipment = await findOneAndUpdateDoc<IShipment>(MONGOOSE_MODELS.SHIPMENT,{ shippoShipmentId: shipment.shippoShipmentId }, payload, {
        new: true,
      });
  
  return {
    shipment,
    label
  }
}

export const track = async (reqBody: TrackSchema, options?: IOptions): Promise<{
  tracking : IShipment | null
}> => { 
  const { carrier, trackingNumber, tracking_number } = reqBody;
    let tracking;

    if (tracking_number) {
      let tracking = await findOneDoc<IShipment>(MONGOOSE_MODELS.SHIPMENT,{ 'label.trackingNumber': tracking_number });
      if (!tracking) throw new ApiError(httpStatus.NOT_FOUND, 'Shipping not found');
    }

    tracking = await handleShipping(shippingCarrier!).trackShipment(carrier, trackingNumber);

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
    tracking
  }
}