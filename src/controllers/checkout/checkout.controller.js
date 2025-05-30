const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { handlePayment } = require('../../services/payment/paymentStrategy');
const {
  paymentGateway: { paymentProvider },
} = require('../../config/config');
const httpStatus = require('http-status');

// checkout
const checkout = catchAsync(async (req, res) => {
  try {
    const user = req.user;
    const { shippingAddress, currency, items, shippoShipmentId, rateObjectId } = req.body;

    // example
    // [
    //     {
    //       price_data: {
    //         currency,
    //         product_data: { name: "item.name" },
    //         unit_amount: 10 * 100,
    //       },
    //       quantity: 1,
    //     },
    //   ]

    const line_items = items.map((ele) => ({
      price_data: {
        currency,
        product_data: {
          name: ele.product_name,
        },
        unit_amount: ele.unit_amount * 100,
      },
      quantity: ele.quantity || 1,
    }));

    const checkoutUrl = await handlePayment(paymentProvider).createCheckoutSession({
      user,
      line_items,
      shippingAddress,
      currency,
      items,
      shippoShipmentId,
      rateObjectId,
    });

    return res.json({
      success: true,
      data: {
        checkoutUrl,
      },
      message: 'Checkout link generate successfully!',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  checkout,
};
