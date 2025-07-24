import { config } from '../config/config';
import { runWithTransaction } from '../models/transaction/transaction';
import * as orderService from '../services/orders/order.service';
import * as paymentService from '../services/payment/payment.service';
import { PAYMENT_STATUS } from '../helpers/constant.helper';
import httpStatus from 'http-status';
import { findOneDoc } from '../helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '../helpers/mongoose.model.helper';
import { notificationQueue } from '@/workers/notification';
import * as shippingService from '@/services/shipping/shipping.service';
const {
  paymentGateway: { paymentSecretKey, paymentWebhookSecret },
} = config;
import Stripe from 'stripe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IUser, IUserProfile } from '@/models/user';
import { IShipment } from '@/models/shipment';

const stripe = new Stripe(paymentSecretKey!, {
  apiVersion: '2025-06-30.basil',
});

export async function handleStripeWebhook(request: FastifyRequest, reply: FastifyReply) {
  const sig = request.headers['stripe-signature'];
  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent((request as any).rawBody, sig!, paymentWebhookSecret!);
  } catch (err) {
    if (err instanceof Error)
      return reply.code(httpStatus.BAD_REQUEST).send({
        success: false,
        message: `Webhook Error: ${err?.message}`,
      });
  }

  const session = event?.data?.object as Stripe.Checkout.Session;

  const { metadata } = session;

  switch (event?.type) {
    case 'checkout.session.completed':
      try {
        await runWithTransaction(async (dbSession: unknown) => {
          // create payment
          const payment = await paymentService.createPayment(
            { sessionId: session?.id },
            {
              transactionId: session?.payment_intent,
              status: PAYMENT_STATUS.PAID,
              rawResponse: session,
            },
          );

          /** Get User data */
          const userData = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
            _id: metadata?.userId,
          });
          const userProfileData = await findOneDoc<IUserProfile>(MONGOOSE_MODELS.USER_PROFILE, {
            user: metadata?.userId,
          });

          /** Get shipping */
          const shippingData = await findOneDoc<IShipment>(MONGOOSE_MODELS.SHIPMENT, {
            shippoShipmentId: metadata?.shippoShipmentId,
          });

          // Update Order
          const order = await orderService.updateOrder(
            { _id: payment?.orderId },
            {
              status: PAYMENT_STATUS.PAID,
              paymentId: payment?._id,
              shipping: shippingData?._id,
            },
            // { session: dbSession }
          );

          /** Update Stock and Inventory  */
          if (order) await paymentService.updateStockInInventory({ order, eventType: event?.type });

          /** Buy Label */
          const { shipment, label } = await shippingService.generateBuyLabel({
            rateObjectId: metadata?.rateObjectId!,
            shippoShipmentId: metadata?.shippoShipmentId!,
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
              },
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
              },
            );
          }

          /** Remove from Cart */
          if (JSON.parse(metadata?.cartIds || '[]')?.length <= 10) {
            await paymentService.updateAllCartStatus(
              { cartIds: JSON.parse(metadata?.cartIds || '[]') },
              { status: PAYMENT_STATUS.PAID },
            );
          }
        });
      } catch (err) {
        console.error('Webhook error (session.completed):', err);
        return reply.code(httpStatus.INTERNAL_SERVER_ERROR).send({
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
      console.log(`Unhandled event type: ${event?.type}`);
  }

  return reply.code(httpStatus.OK).send({ received: true });
}

interface PaymentPayload {
  event: { type: Stripe.Event['type'] };
}

async function handlePaymentFailure(payload: PaymentPayload, session: Stripe.Checkout.Session) {
  const { event } = payload;
  const payment = await paymentService.createPayment(
    { sessionId: session?.id },
    { status: PAYMENT_STATUS.FAILED },
    // { session }
  );

  const order = await orderService.updateOrder(
    { _id: payment?.orderId },
    { status: PAYMENT_STATUS.FAILED },
    // { session }
  );

  /** If order fail then update stock and reserved */
  if (order) await paymentService.updateStockInInventory({ order, eventType: event.type });
}

async function handlePaymentExpired(payload: PaymentPayload, session: Stripe.Checkout.Session) {
  const { event } = payload;
  const payment = await paymentService.createPayment(
    { sessionId: session?.id },
    { status: PAYMENT_STATUS.EXPIRED },
    // { session }
  );

  const order = await orderService.updateOrder(
    { _id: payment?.orderId },
    { status: PAYMENT_STATUS.EXPIRED },
    // { session }
  );

  /** If order fail then update stock and reserved */
  if (order) await paymentService.updateStockInInventory({ order, eventType: event?.type });
}
