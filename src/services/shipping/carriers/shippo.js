const {
  shipping: { shippingApiKey },
} = require('../../../config/config');
const { Shippo } = require('shippo');
const shippingService = require('../shipping.service');

const shippo = new Shippo({
  apiKeyHeader: shippingApiKey,
});

/**
 * Create shipment
 * @param {string} payload
 * @returns
 */
const createShipment = async (addressFrom, addressTo, parcel) => {
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

const buyLabel = async (rateObjectId) => {
  const transaction = await shippo.transactions.create({
    rate: rateObjectId,
    labelFileType: 'PDF',
    async: false,
  });

  if (transaction.status !== 'SUCCESS') {
    throw new Error(transaction.messages.map((m) => m.text).join(', '));
  }

  return transaction;
};

const trackShipment = async (carrier, trackingNumber) => {
  const tracking = await shippo.trackingStatus.get(trackingNumber, carrier);
  return tracking;
};

/**
 * Generate Buy Label
 * @param {object} reqBody
 * @return {object} {shipping,label}
 */
const generateBuyLabel = async (reqBody) => {
  const { shippoShipmentId, rateObjectId } = reqBody;

  let shipment = await shippingService.getShipping({
    shippoShipmentId,
  });

  if (!shipment) throw new Error('Shipping not valid.');

  /** Create label */
  const label = await buyLabel(rateObjectId);

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

  return {
    shipment,
    label,
  };
};

module.exports = { createShipment, buyLabel, trackShipment, generateBuyLabel };
