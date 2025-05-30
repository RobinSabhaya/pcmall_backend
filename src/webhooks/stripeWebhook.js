const {
  paymentGateway: { paymentSecretKey, paymentWebhookSecret },
  shipping: { shippingCarrier },
} = require('../config/config');
const stripe = require('stripe')(paymentSecretKey);
const { runWithTransaction } = require('../models/transaction/transaction');
const orderService = require('../services/orders/order.service');
const paymentService = require('../services/payment/payment.service');
const { PAYMENT_STATUS } = require('../helpers/constant.helper');
const httpStatus = require('http-status');
const { handleShipping } = require('../services/shipping/shippingStrategy');

async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, paymentWebhookSecret);
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  const session = event.data?.object;

  const { metadata } = session;

  switch (event.type) {
    case 'checkout.session.completed':
      try {
        await runWithTransaction(async (dbSession) => {
          // create payment
          const payment = await paymentService.createPayment(
            { sessionId: session.id },
            {
              transactionId: session.payment_intent,
              status: PAYMENT_STATUS.PAID,
              rawResponse: session,
            }
          );

          // Update Order
          const order = await orderService.updateOrder(
            { _id: payment.orderId },
            {
              status: PAYMENT_STATUS.PAID,
            }
            // { session: dbSession }
          );

          /** Buy Label */
          const { shipment, label } = await handleShipping(shippingCarrier).generateBuyLabel({
            rateObjectId: metadata.rateObjectId,
            shippoShipmentId: metadata.shippoShipmentId,
          });
          console.log('🚀 ~ const{shipment,label}=awaithandleShipping ~ shipment:', shipment);
          console.log('🚀 ~ const{shipment,label}=awaithandleShipping ~ label:', label);
        });
      } catch (err) {
        console.error('Webhook error (session.completed):', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Failed to process payment',
        });
      }
      break;

    case 'checkout.session.async_payment_failed':
      await handlePaymentFailure(session);
      break;

    case 'checkout.session.expired':
      await handlePaymentExpired(session);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}

async function handlePaymentFailure(session) {
  const payment = await paymentService.createPayment(
    { sessionId: session.id },
    { status: PAYMENT_STATUS.FAILED }
    // { session }
  );

  await orderService.updateOrder(
    { _id: payment.orderId },
    { status: PAYMENT_STATUS.FAILED }
    // { session }
  );
}

async function handlePaymentExpired(session) {
  const payment = await paymentService.createPayment(
    { sessionId: session.id },
    { status: PAYMENT_STATUS.EXPIRED }
    // { session }
  );

  await orderService.updateOrder(
    { _id: payment.orderId },
    { status: PAYMENT_STATUS.EXPIRED }
    // { session }
  );
}

module.exports = { handleStripeWebhook };
