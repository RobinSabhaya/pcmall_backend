const { Payment } = require('../../models/payment/index');

/**
 * Create payment
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Payment>}
 */
const createPayment = (filter, reqBody, options = {}) => {
  return Payment.findOneAndUpdate(filter, reqBody, options);
};

module.exports = {
  createPayment,
};
