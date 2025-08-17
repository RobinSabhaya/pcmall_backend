import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';
import Stripe from 'stripe';

import { IShipment } from '@/models/shipment';
import { IUser, IUserProfile } from '@/models/user';
import * as shippingService from '@/services/shipping/shipping.service';
import { notificationQueue } from '@/workers/notification';

import { config } from '../config/config';
import { PAYMENTSTATUS } from '../helpers/constant.helper';
import { findOneDoc } from '../helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '../helpers/mongoose.model.helper';
import { IOrder } from '../models/orders';
import { IPayment } from '../models/payment';
import { runWithTransaction } from '../models/transaction/transaction';
import * as orderService from '../services/orders/order.service';
import * as paymentService from '../services/payment/payment.service';

const {
  paymentGateway: { paymentSecretKey, paymentWebhookSecret },
} = config;

const stripe = new Stripe(paymentSecretKey!, {
  apiVersion: '2025-06-30.basil',
});

// eslint-disable-next-line complexity
export async function handleStripeWebhook(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> {
  const sig = request.headers['stripe-signature'];
  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(
      (request as FastifyRequest).rawBody,
      sig!,
      paymentWebhookSecret!
    );
  } catch (error) {
    if (error instanceof Error)
      return reply.code(httpStatus.BAD_REQUEST).send({
        success: false,
        message: `Webhook Error: ${error?.message}`,
      });
  }

  const session = event?.data?.object as Stripe.Checkout.Session;

  const { metadata, payment_intent } = session;

  switch (event?.type) {
    case 'checkout.session.completed':
      {
        try {
          // eslint-disable-next-line complexity
          await runWithTransaction(async () => {
            const { id } = session;
            // create payment
            const payment = await paymentService.createPayment(
              { sessionId: id },
              {
                transactionId: payment_intent,
                status: PAYMENTSTATUS.PAID,
                rawResponse: session,
              }
            );

            /** Get User data */
            const userData = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
              _id: metadata?.userId,
            });
            const userProfileData = await findOneDoc<IUserProfile>(
              MONGOOSE_MODELS.USER_PROFILE,
              {
                user: metadata?.userId,
              }
            );

            const { order } = await processingOrder({
              shippoShipmentId: metadata?.shippoShipmentId!,
              payment,
              event,
            });

            /** Buy Label */
            await shippingService.generateBuyLabel({
              rateObjectId: metadata?.rateObjectId!,
              shippoShipmentId: metadata?.shippoShipmentId!,
            });

            // send success notifications
            await sendNotifications({
              userData,
              userProfileData,
              order,
            });

            /** Remove from Cart */
            if (JSON.parse(metadata?.cartIds ?? '[]')?.length <= 10) {
              await paymentService.updateAllCartStatus(
                { cartIds: JSON.parse(metadata?.cartIds ?? '[]') },
                { status: PAYMENTSTATUS.PAID }
              );
            }
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Webhook error (session.completed):', error);
          return reply.code(httpStatus.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Failed to process payment',
          });
        }
      }
      break;

    case 'checkout.session.async_payment_failed':
      {
        try {
          await handlePaymentFailure({ event }, session);
        } catch (error) {
          console.error('Webhook error (session.failed)', error);
        }
      }
      break;

    case 'checkout.session.expired':
      {
        try {
          await handlePaymentExpired({ event }, session);
        } catch (error) {
          console.error('Webhook error (session.expired)', error);
        }
      }
      break;

    default:
      console.log(`Unhandled event type: ${event?.type}`);
  }

  return reply.code(httpStatus.OK).send({ success: true });
}

interface IPaymentPayload {
  event: { type: Stripe.Event['type'] };
}

async function handlePaymentFailure(
  payload: IPaymentPayload,
  session: Stripe.Checkout.Session
): Promise<void> {
  const { event } = payload;
  const payment = await paymentService.createPayment(
    { sessionId: session?.id },
    { status: PAYMENTSTATUS.FAILED }
    // { session }
  );

  const order = await orderService.updateOrder(
    { _id: payment?.orderId },
    { status: PAYMENTSTATUS.FAILED }
    // { session }
  );

  /** If order fail then update stock and reserved */
  if (order)
    await paymentService.updateStockInInventory({
      order,
      eventType: event.type,
    });
}

async function handlePaymentExpired(
  payload: IPaymentPayload,
  session: Stripe.Checkout.Session
): Promise<void> {
  const { event } = payload;
  const payment = await paymentService.createPayment(
    { sessionId: session?.id },
    { status: PAYMENTSTATUS.EXPIRED }
    // { session }
  );

  const order = await orderService.updateOrder(
    { _id: payment?.orderId },
    { status: PAYMENTSTATUS.EXPIRED }
    // { session }
  );

  /** If order fail then update stock and reserved */
  if (order)
    await paymentService.updateStockInInventory({
      order,
      eventType: event?.type,
    });
}

export const sendNotifications = async ({
  userData,
  userProfileData,
  order,
}: {
  userData: IUser | null;
  userProfileData: IUserProfile | null;
  order: IOrder | null;
}): Promise<void> => {
  /** Send SMS */
  if (userData?.phone_number !== null) {
    await notificationQueue.add(
      `order_${order?._id}`,
      {
        type: 'sms',
        userData,
        userProfileData,
        order,
      },
      {
        delay: 100_000,
      }
    );
  }

  if (userData?.email !== null) {
    await notificationQueue.add(
      `order_${order?._id}`,
      {
        type: 'email',
        userData,
        userProfileData,
        order,
      },
      {
        delay: 100_000,
      }
    );
  }
};

export interface IProcessingOrder extends IPaymentPayload {
  shippoShipmentId: string;
  payment: IPayment | null;
}

export const processingOrder = async ({
  shippoShipmentId,
  payment,
  event,
}: IProcessingOrder): Promise<{
  order: IOrder | null;
  shippingData: IShipment | null;
}> => {
  /** Get shipping */
  const shippingData = await findOneDoc<IShipment>(MONGOOSE_MODELS.SHIPMENT, {
    shippoShipmentId,
  });

  // Update Order
  const order = await orderService.updateOrder(
    { _id: payment?.orderId },
    {
      status: PAYMENTSTATUS.PAID,
      paymentId: payment?._id,
      shipping: shippingData?._id,
    }
    // { session: dbSession }
  );

  /** Update Stock and Inventory  */
  if (order)
    await paymentService.updateStockInInventory({
      order,
      eventType: event?.type,
    });

  return {
    order,
    shippingData,
  };
};
