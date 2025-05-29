const {
  shipping: { shippingApiKey },
} = require('../../../config/config');
const { Shippo } = require('shippo');

const shippo = new Shippo({
  apiKeyHeader: shippingApiKey,
});

/**
 * Create shipment
 * @param {string} payload
 * @returns
 */
const createShipment = async (addressFrom ,addressTo, parcel ) => {
  const shipment = await shippo.shipments.create({
    addressFrom,
    addressTo,
    parcels: [parcel],
    async: false,
  });
  console.log("🚀 ~ createShipment ~ shipment:", shipment)

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

module.exports = { createShipment, buyLabel, trackShipment };
