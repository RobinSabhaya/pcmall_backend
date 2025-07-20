import {
  config
} from '../../../config/config';
import { AddressCreateRequest, ParcelCreateFromTemplateRequest, Rate, Shippo } from 'shippo';

const { shipping: { shippingApiKey }, } = config;
const shippo = new Shippo({
  apiKeyHeader: shippingApiKey,
});

/**
 * Create shipment
 * @param {string} payload
 * @returns
 */
export const createShipment = async (addressFrom:AddressCreateRequest, addressTo:AddressCreateRequest, parcel:ParcelCreateFromTemplateRequest) => {
  const shipment = await shippo.shipments.create({
    addressFrom,
    addressTo,
    parcels: [parcel],
    async: false,
  });
  console.log('🚀 ~ createShipment ~ shipment:', shipment);

  if (!shipment.rates || shipment.rates.length === 0) {
    throw new Error('No rates returned by Shippo');
  }

  return shipment;
};

export const buyLabel = async (rate:Rate) => {
  const transaction = await shippo.transactions.create({
    rate: rate.objectId,
    labelFileType: 'PDF',
    async: false,
  });

  if (transaction.status !== 'SUCCESS') {
    throw new Error(transaction?.messages?.map((m) => m.text).join(', '));
  }

  return transaction;
};

export const trackShipment = async (carrier:string, trackingNumber:string) => {
  const tracking = await shippo.trackingStatus.get(trackingNumber, carrier);
  return tracking;
};
