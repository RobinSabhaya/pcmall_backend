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
const { findOneDoc } = require('../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../helpers/mongoose.model.helper');
const { handleSMS } = require('../services/sms/smsStrategy');
const { ORDER_PAYMENT_SHIPPING_SUCCESS_SMS } = require('../helpers/template.helper');
const moment = require('moment');

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
          const userProfileData = await findOneDoc(MONGOOSE_MODELS.USER, {
            user: metadata.userId,
          });

          /** Get shipping */
          const shippingData = await findOneDoc(MONGOOSE_MODELS.SHIPMENT, { shippoShipmentId: metadata.shippoShipmentId });

          // Update Order
          const order = await orderService.updateOrder(
            { _id: payment.orderId },
            {
              status: PAYMENT_STATUS.PAID,
              paymentId: session.payment_intent,
              shipping: shippingData._id,
            }
            // { session: dbSession }
          );

          /** Buy Label */
          const { shipment, label } = await handleShipping(shippingCarrier).generateBuyLabel({
            rateObjectId: metadata.rateObjectId,
            shippoShipmentId: metadata.shippoShipmentId,
          });

          if (!shipment || !label) throw new ApiError(httpStatus.BAD_REQUEST, 'Shipment and Label has been fail');

          /** Send SMS */
          if (userData?.phone_number)
            await handleSMS(smsCarrier).sendSMS({
              to: userData?.phone_number,
              body: ORDER_PAYMENT_SHIPPING_SUCCESS_SMS({
                customerName:
                  userProfileData?.first_name + ' ' + (userProfileData?.last_name && userProfileData?.last_name) || 'User',
                orderDate: moment(order?.updatedAt).format('DD-MM-YYYY') || moment().format('DD-MM-YYYY'),
                orderId: String(order?._id),
                storeName: 'PCMall',
              }),
            });
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

  return res.status(httpStatus.OK).json({ received: true });
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
