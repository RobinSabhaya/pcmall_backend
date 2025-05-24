const STRIPE_KEY = process.env.STRIPE_KEY;
const SHIPPING_CARRIER = process.env.SHIPPING_CARRIER;
const stripe = require('stripe')(STRIPE_KEY);
const { runWithTransaction } = require('../models/transaction/transaction');
const orderService = require('../services/orders/order.service');
const paymentService = require('../services/payment/payment.service');
const { handleShipping } = require('../services/shipping/shippingStrategy');
const { PAYMENT_STATUS } = require('../helpers/constant.helper');

async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  const session = event.data?.object;

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

          // Handle shipping
          await handleShipping(SHIPPING_CARRIER, order, dbSession);
        });
      } catch (err) {
        console.error('Webhook error (session.completed):', err);
        return res.status(500).send({
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

  res.status(200).json({ received: true });
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
