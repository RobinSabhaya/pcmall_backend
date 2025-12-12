import { status as httpStatus } from 'http-status';
import Stripe from 'stripe';

import { PAYMENTSTATUS } from '@/helpers/constant.helper';
import { findOneAndUpdateDoc, findOneDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IPayment } from '@/models/payment';
import { IPaymentRefund } from '@/models/payment/paymentRefund.model';
import { IProductSKU } from '@/models/product';
import { IUser } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';
import { CheckoutSchema } from '@/validations/checkout.validation';
import { CreatePaymentRefundSchema } from '@/validations/payment.validation';

import { config } from '../../../config/config';
import { formatPrice } from '../../../utils/custom.util';
import * as orderService from '../../orders/order.service';
import * as paymentService from '../payment.service';

import {
  ICalculateCostPayload,
  ICalculateCostResponse,
} from './stripe.service.type';

const stripe = new Stripe(config.paymentGateway.paymentSecretKey!);

interface ICreateCheckoutSession extends CheckoutSchema {
  user: IUser;
}

export const createPaymentIntent = async ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}): Promise<Stripe.PaymentIntent> => {
  return stripe.paymentIntents.create({
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
export async function createCheckoutSession(
  payload: ICreateCheckoutSession
): Promise<string | null | undefined> {
  const {
    user,
    shippingAddress,
    items,
    currency,
    // shippoShipmentId,
    // rateObjectId,
    cartIds,
  } = payload;

  // await runWithTransaction(async (dbSession: unknown) => {
  let session;
  const { itemsData, lineItems, totalAmount, subtotal, shippingCost, tax } =
    await calculateCost({
      items,
      currency,
    });

  const userData = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
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

  if (order != null) {
    session = (await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${config.paymentGateway.paymentSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: config.paymentGateway.paymentCancelUrl,
      metadata: {
        orderId: order._id.toString(),
        userId: String(user._id),
        // shippoShipmentId, // TODO: Remove shipment and move to manually from Admin side
        // rateObjectId,
        cartIds: JSON.stringify(cartIds),
      },
      customer_email: userData?.email,
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
    })) as Stripe.Checkout.Session;

    await paymentService.createPayment(
      {
        orderId: order._id,
        provider: config.paymentGateway.paymentProvider,
        sessionId: session?.id,
        amount: totalAmount,
        currency,
      },
      {
        orderId: order._id,
        provider: config.paymentGateway.paymentProvider,
        sessionId: session?.id,
        amount: totalAmount,
        currency,
      },
      {
        new: true,
        upsert: true,
        // session: dbSession,
      }
    );
  }
  return session?.url;
  // });

  // return null;
}

export async function createPaymentRefund(
  payload: CreatePaymentRefundSchema
): Promise<{
  paymentData: IPayment | null;
  message: string;
}> {
  const { transactionId, partial_amount, reason } = payload;

  const paymentRefundPayload: Stripe.RefundCreateParams = {
    payment_intent: transactionId,
    ...(partial_amount != null &&
    partial_amount > 0 &&
    !Number.isNaN(partial_amount)
      ? { amount: partial_amount }
      : {}),
    ...(reason != null ? { reason: 'requested_by_customer' } : {}),
  };

  const refund = await stripe.refunds.create(paymentRefundPayload);

  const paymentData = await findOneDoc<IPayment>(MONGOOSE_MODELS.PAYMENT, {
    transactionId,
    status: PAYMENTSTATUS.PAID,
  });

  if (!paymentData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment is not refundable');
  }

  const isSuccess = refund.status === 'succeeded';

  const refundPayload = {
    paymentId: paymentData._id,
    refundId: refund.id,
    chargeId: refund.charge,
    balance_transaction: refund.balance_transaction,
    amount: refund.amount,
    currency: refund.currency,
    reason,
    status: isSuccess
      ? PAYMENTSTATUS.REFUND_SUCCESS
      : PAYMENTSTATUS.REFUND_FAILED,
  };

  const message = isSuccess
    ? 'Payment refund successfully'
    : 'Payment refund failed';

  await findOneAndUpdateDoc<IPaymentRefund>(
    MONGOOSE_MODELS.PAYMENT_REFUND,
    refundPayload,
    refundPayload,
    {
      new: true,
      upsert: true,
    }
  );

  return { paymentData, message };
}

export const calculateCost = async (
  payload: ICalculateCostPayload
): Promise<ICalculateCostResponse> => {
  const { items, currency } = payload;

  const productSkuDataArray = await Promise.all(
    items.map(async item =>
      findOneDoc<IProductSKU>(MONGOOSE_MODELS.PRODUCT_SKU, {
        variant: item.productVariantId,
      })
    )
  );

  const processedData = items.map((item, index) => {
    const productSkuData = productSkuDataArray[index];

    if (!productSkuData) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Product sku not found');
    }

    const lineItem = {
      price_data: {
        currency,
        product_data: {
          name: item.product_name,
        },
        unit_amount: formatPrice(productSkuData.price * 100, 2),
      },
      quantity: item?.quantity || 1,
    };

    const itemData = {
      variant: item.productVariantId,
      quantity: item?.quantity || 1,
      unitPrice: formatPrice(productSkuData.price * 100, 2),
      totalPrice: formatPrice(
        productSkuData.price * 100 * (item?.quantity || 1),
        2
      ),
    };

    return { lineItem, itemData };
  });

  const lineItems = processedData.map(data => data.lineItem);
  const itemsData = processedData.map(data => data.itemData);

  // Calculate totals
  const subtotal = lineItems.reduce(
    (acc, item) => acc + item.price_data.unit_amount * item.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const shippingCost = 1000;

  const totalAmount = formatPrice(subtotal + tax + shippingCost, 2);

  return {
    totalAmount,
    subtotal,
    tax,
    shippingCost,
    lineItems,
    itemsData,
  };
};
