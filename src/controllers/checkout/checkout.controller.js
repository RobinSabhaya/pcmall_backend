const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { handlePayment } = require('../../services/payment/paymentStrategy');
const {
  paymentGateway: { paymentProvider },
} = require('../../config/config');
const httpStatus = require('http-status');
const { findOneDoc, findDoc } = require('../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');

// checkout
const checkout = catchAsync(async (req, res) => {
  try {
    const user = req.user;
    const { shippingAddress, currency, items, shippoShipmentId, rateObjectId, cartIds } = req.body;

    // example
    // [
    //     {
    //       price_data: {
    //         currency,
    //         product_data: { name: "item.name" },
    //         unit_amount: 10 * 100,
    //           productVariantId:
    //       },
    //       quantity: 1,
    //     },
    //   ]

    const productVariantData = await findDoc(MONGOOSE_MODELS.PRODUCT_VARIANT, {
      _id: items.map((i) => i.productVariantId),
    });

    if (!productVariantData?.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Product variant not valid');

    const checkoutUrl = await handlePayment(paymentProvider).createCheckoutSession({
      user,
      items,
      shippingAddress,
      currency,
      shippoShipmentId,
      rateObjectId,
      cartIds,
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
