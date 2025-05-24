const {Order} = require('../../models/orders/index');
const { paginationQuery } = require('../../helpers/mongoose.helper');

/**
 * Get order list
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Order]>}
 */
const getOrderList = (filter, options = {}) => {
  const pagination = paginationQuery(options);

  return Order.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    ...pagination,
  ]);
};

/**
 * Update Order
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Order>}
 */
const updateOrder = (filter, reqBody, options = {}) => {
  return Order.findOneAndUpdate(filter, reqBody, options);
};

module.exports = {
  getOrderList,
  updateOrder,
};
