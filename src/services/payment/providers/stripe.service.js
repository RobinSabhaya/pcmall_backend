const Stripe = require('stripe');
const {
  paymentGateway: { paymentProvider, paymentSecretKey, paymentSuccessUrl, paymentCancelUrl },
} = require('../../../config/config');
const stripe = new Stripe(paymentSecretKey);
const paymentService = require('../../payment/payment.service');
const orderService = require('../../orders/order.service');
const userService = require('../../user/user.service');
const { runWithTransaction } = require('../../../models/transaction/transaction');
const { findOneDoc } = require('../../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../../helpers/mongoose.model.helper');

const createPaymentIntent = async ({ amount, currency }) => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
  });
};

/**
 * Create checkout session
 * @param {object} payload
 * @returns {string} success url
 */
async function createCheckoutSession(payload) {
  const { user, shippingAddress, items, currency, shippoShipmentId, rateObjectId, cartIds } = payload;

  let session;

  await runWithTransaction(async (dbSession) => {
    let line_items = [];
    let itemsData = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const productSkuData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_SKU, { variant: item.productVariantId });
      line_items.push({
        price_data: {
          currency,
          product_data: {
            name: item.product_name,
          },
          unit_amount: productSkuData.price * 100,
        },
        quantity: item?.quantity || 1,
      });

      itemsData.push({
        variant: item.productVariantId,
        quantity: item?.quantity || 1,
        unitPrice: productSkuData.price * 100,
        totalPrice: productSkuData.price * 100 * item?.quantity,
      });
    }
    const subtotal = line_items.reduce((acc, item) => acc + item.price_data.unit_amount * item.quantity, 0);
    const tax = subtotal * 0.1;
    const shippingCost = 10;
    const totalAmount = (tax + shippingCost) * 100;

    const addressData = await userService.getAddress({
      _id: shippingAddress,
    });

    const userData = await userService.getFilterUser({
      _id: user._id,
    });

    const order = await orderService.updateOrder(
      {
        user: user._id,
        items: itemsData,
        shippingAddress,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
      },
      {
        user: user._id,
        items: itemsData,
        shippingAddress,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
      },
      {
        new: true,
        upsert: true,
      }
    );

    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${paymentSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: paymentCancelUrl,
      metadata: {
        orderId: order._id.toString(),
        userId: String(user._id),
        shippoShipmentId,
        rateObjectId,
        cartIds: JSON.stringify(cartIds),
      },
      customer_email: userData.email,
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
    });

    await paymentService.createPayment(
      {
        orderId: order._id,
        provider: paymentProvider,
        sessionId: session.id,
        amount: totalAmount,
        currency,
      },
      {
        orderId: order._id,
        provider: paymentProvider,
        sessionId: session.id,
        amount: totalAmount,
        currency,
      },
      {
        new: true,
        upsert: true,
        // session: dbSession,
      }
    );
  });

  return session.url;
}

module.exports = {
  createPaymentIntent,
  createCheckoutSession,
};
