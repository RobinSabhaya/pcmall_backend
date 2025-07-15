const {
  paymentGateway: { paymentSecretKey, paymentWebhookSecret },
  shipping: { shippingCarrier },
  sms: { smsCarrier },
} = require('../config/config');
const stripe = require('stripe')(paymentSecretKey);
const { runWithTransaction } = require('../models/transaction/transaction');
const orderService = require('../services/orders/order.service');
const paymentService = require('../services/payment/payment.service');
const { PAYMENT_STATUS } = require('../helpers/constant.helper');
const httpStatus = require('http-status');
const { handleShipping } = require('../services/shipping/shippingStrategy');
const { findOneDoc, findOneAndUpdateDoc, findDoc } = require('../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../helpers/mongoose.model.helper');
const { handleSMS } = require('../services/sms/smsStrategy');
const { ORDER_PAYMENT_SHIPPING_SUCCESS_SMS } = require('../helpers/template.helper');
const moment = require('moment');
const { notificationQueue } = require('../workers/notification');

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

          /** Get User data */
          const userData = await findOneDoc(MONGOOSE_MODELS.USER, {
            _id: metadata.userId,
          });
          const userProfileData = await findOneDoc(MONGOOSE_MODELS.USER_PROFILE, {
            user: metadata.userId,
          });

          /** Get shipping */
          const shippingData = await findOneDoc(MONGOOSE_MODELS.SHIPMENT, { shippoShipmentId: metadata.shippoShipmentId });

          // Update Order
          const order = await orderService.updateOrder(
            { _id: payment.orderId },
            {
              status: PAYMENT_STATUS.PAID,
              paymentId: payment._id,
              shipping: shippingData._id,
            }
            // { session: dbSession }
          );

          /** Update Stock and Inventory  */
          await paymentService.updateStockInInventory({ order, eventType: event.type });

          /** Buy Label */
          const { shipment, label } = await handleShipping(shippingCarrier).generateBuyLabel({
            rateObjectId: metadata.rateObjectId,
            shippoShipmentId: metadata.shippoShipmentId,
          });

          if (!shipment || !label) console.error('Shipment and Label has been fail');

          /** Send SMS */
          if (userData?.phone_number) {
            notificationQueue.add(
              `order_${order?._id}`,
              {
                type: 'sms',
                userData,
                userProfileData,
                order,
              },
              {
                delay: 100000,
              }
            );
          }

          if (userData?.email) {
            notificationQueue.add(
              `order_${order?._id}`,
              {
                type: 'email',
                userData,
                userProfileData,
                order,
              },
              {
                delay: 100000,
              }
            );
          }

          /** Remove from Cart */
          if (JSON.parse(metadata?.cartIds || [])?.length <= 10) {
            await paymentService.updateAllCartStatus(
              { cartIds: JSON.parse(metadata?.cartIds || []) },
              { status: PAYMENT_STATUS.PAID }
            );
          }
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
      try {
        await handlePaymentFailure({ event }, session);
      } catch (error) {
        console.error('Webhook error (session.failed)', error);
      }
      break;

    case 'checkout.session.expired':
      try {
        await handlePaymentExpired({ event }, session);
      } catch (error) {
        console.error('Webhook error (session.expired)', error);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(httpStatus.OK).json({ received: true });
}

async function handlePaymentFailure(payload, session) {
  const { event } = payload;
  const payment = await paymentService.createPayment(
    { sessionId: session.id },
    { status: PAYMENT_STATUS.FAILED }
    // { session }
  );

  const order = await orderService.updateOrder(
    MONGOOSE_MODELS.INVENTORY,
    { _id: payment.orderId },
    { status: PAYMENT_STATUS.FAILED }
    // { session }
  );

  /** If order fail then update stock and reserved */
  await paymentService.updateStockInInventory({ order, eventType: event.type });
}

async function handlePaymentExpired(payload, session) {
  const { event } = payload;
  const payment = await paymentService.createPayment(
    { sessionId: session.id },
    { status: PAYMENT_STATUS.EXPIRED }
    // { session }
  );

  const order = await orderService.updateOrder(
    { _id: payment.orderId },
    { status: PAYMENT_STATUS.EXPIRED }
    // { session }
  );

  /** If order fail then update stock and reserved */
  await paymentService.updateStockInInventory({ order, eventType: event.type });
}

module.exports = { handleStripeWebhook };
