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

module.exports = {
  createAndUpdateShipping,
};
