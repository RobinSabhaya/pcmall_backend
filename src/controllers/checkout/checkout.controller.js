const catchAsync = require('../../utils/catchAsync');
const stripeService = require('../../services/payment/providers/stripe.service');

// checkout
const checkout = catchAsync(async (req, res) => {
  try {
    const user = req.user;
    const { shippingAddress, currency, items } = req.body;

    // create payment intent v1
    // const intent = await stripeService.createPaymentIntent({
    //   amount,
    //   currency,
    // });

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
          name: 'ele.name',
        },
        unit_amount: ele.unitPrice * 100,
      },
      quantity: ele.quantity || 1,
    }));

    const checkoutUrl = await stripeService.createCheckoutSession({
      user,
      line_items,
      shippingAddress,
      currency,
      items,
    });

    // save in db in v1
    // await paymentService.createPayment({
    //   customerId,
    //   customerEmail: session.customer_email,
    //   cartIds,
    //   paymentIntentId: session.payment_intent,
    //   amount: session.amount_total,
    //   currency: session.currency,
    //   status: session.payment_status,
    //   stripeSessionId: session.id,
    // });

    // return res.json({
    //   success: true,
    //   data: {
    //     client_secret: intent.client_secret,
    //   },
    //   message: "Checkout successfully!",
    // });

    return res.json({
      success: true,
      data: {
        checkoutUrl,
      },
      message: 'Checkout successfully!',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  checkout,
};
