const { Shipment } = require('../../models/shipment');

/**
 * Create and Update Shipment
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Shipment>}
 */
const createAndUpdateShipping = (filter, reqBody, options = {}) => {
  return Shipment.findOneAndUpdate(filter, reqBody, options);
};

/**
 * Get Shipment
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Shipment>}
 */
const getShipping = (filter, options = {}) => {
  return Shipment.findOne(filter, options);
};

module.exports = {
  createAndUpdateShipping,
  getShipping,
};
