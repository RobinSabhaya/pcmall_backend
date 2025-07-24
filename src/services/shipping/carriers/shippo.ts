import { config } from '../../../config/config';
import {
  AddressCreateRequest,
  ParcelCreateFromTemplateRequest,
  ParcelCreateRequest,
  Rate,
  Shipment,
  Shippo,
} from 'shippo';

const {
  shipping: { shippingApiKey },
} = config;
const shippo = new Shippo({
  apiKeyHeader: shippingApiKey,
});

/**
 * Create shipment
 * @param {string} payload
 * @returns
 */
export const createShipment = async (
  addressFrom: AddressCreateRequest,
  addressTo: AddressCreateRequest,
  parcel: ParcelCreateRequest,
): Promise<Shipment> => {
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

export const buyLabel = async (rateObjectId: string) => {
  const transaction = await shippo.transactions.create({
    rate: rateObjectId,
    labelFileType: 'PDF',
    async: false,
  });

  if (transaction.status !== 'SUCCESS') {
    throw new Error(transaction?.messages?.map((m) => m.text).join(', '));
  }

  return transaction;
};

export const trackShipment = async (carrier: string, trackingNumber: string) => {
  const tracking = await shippo.trackingStatus.get(trackingNumber, carrier);
  return tracking;
};
