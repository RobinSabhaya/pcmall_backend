const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY;
const { Shippo } = require("shippo");

const shippo = new Shippo({
  apiKeyHeader: SHIPPO_API_KEY,
});

/**
 * Create shipment
 * @param {string} payload
 * @returns
 */
const createShipment = async ({ from_address, to_address, parcel }) => {
  const shipment = await shippo.shipments.create({
    addressFrom: from_address,
    addressTo: to_address,
    parcels: [parcel],
    async: false,
  });

  if (!shipment.rates || shipment.rates.length === 0) {
    throw new Error("No rates returned by Shippo");
  }

  return shipment;
};

const buyLabel = async (rateObjectId) => {
  const transaction = await shippo.transactions.create({
    rate: rateObjectId,
    labelFileType: "PDF",
    async: false,
  });

  if (transaction.status !== "SUCCESS") {
    throw new Error(transaction.messages.map((m) => m.text).join(", "));
  }

  return transaction;
};

const trackShipment = async (carrier, trackingNumber) => {
  const tracking = await shippo.trackingStatus(carrier, trackingNumber);
  return tracking;
};

module.exports = { createShipment, buyLabel, trackShipment };
