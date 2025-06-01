const catchAsync = require('../../utils/catchAsync');
const orderService = require('../../services/orders/order.service');
const mongoose = require('mongoose');

/**
 * Get order list
 */
const getOrderList = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { ...options } = req.query;

  const orderData = await orderService.getOrderList(
    {
      user: new mongoose.Types.ObjectId(_id),
    },
    options
  );

  return res.status(200).json({
    success: true,
    data: orderData[0],
  });
});

module.exports = {
  getOrderList,
};
