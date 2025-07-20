import { IProductSKU } from "@/models/product";
import { IUser } from "@/models/user";
import { CheckoutSchema } from "@/validations/checkout.validation";

import Stripe from 'stripe'
import httpStatus from 'http-status'
import {
  config
} from '../../../config/config'
import * as paymentService from '../payment.service';
import * as orderService from '../../orders/order.service';
import * as userService from '../../user/user.service';
import { runWithTransaction } from '@/models/transaction/transaction';
import { findOneDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import ApiError from "@/utils/ApiError";
const stripe = new Stripe(config.paymentGateway.paymentSecretKey!);

interface ICreateCheckoutSession extends CheckoutSchema{
  user : IUser
}

export const createPaymentIntent = async ({ amount, currency }:{amount : number, currency:string}) => {
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
export async function createCheckoutSession(payload: ICreateCheckoutSession):Promise<string> {
  const { user, shippingAddress, items, currency, shippoShipmentId, rateObjectId, cartIds } = payload

  let session:unknown;

  await runWithTransaction(async (dbSession:unknown) => {
    let line_items = [];
    let itemsData = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const productSkuData = await findOneDoc<IProductSKU>(MONGOOSE_MODELS.PRODUCT_SKU, { variant: item.productVariantId });

      if (!productSkuData) throw new ApiError(httpStatus.BAD_REQUEST,'Product sku not found')
      
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

    if (order) { 

    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${config.paymentGateway.paymentSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: config.paymentGateway.paymentCancelUrl,
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
    }) as Stripe.Checkout.Session;

    await paymentService.createPayment(
      {
        orderId: order._id,
        provider: config.paymentGateway.paymentProvider,
        sessionId: session.id,
        amount: totalAmount,
        currency,
      },
      {
        orderId: order._id,
        provider: config.paymentGateway.paymentProvider,
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
    }
  });

  return session?.url as string;
}