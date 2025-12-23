import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import configuration from '../../config/configuration';
import { CreateRefundDto } from '../dto/payment.dto';

import { IPaymentStrategy } from './payment.strategy';
import {
  ICreateCheckoutSession,
  ICreateCheckoutSessionResponse,
  ICreateRefundResponse,
} from './stripe.strategy.interface';

@Injectable()
export class StripeStrategy implements IPaymentStrategy {
  private readonly stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(configuration().paymentGateway.paymentSecretKey);
  }

  async createCheckoutSession(
    payload: ICreateCheckoutSession,
  ): Promise<ICreateCheckoutSessionResponse> {
    const { userId, lineItems, email, cartIds, orderId } = payload;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${configuration().paymentGateway.paymentSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: configuration().paymentGateway.paymentCancelUrl,
      metadata: {
        orderId: orderId.toString(),
        userId: String(userId),
        cartIds: JSON.stringify(cartIds),
      },
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
    });
    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  }

  async createPaymentRefund(
    payload: CreateRefundDto,
  ): Promise<ICreateRefundResponse> {
    const { transactionId, partial_amount } = payload;

    const paymentRefundPayload: Stripe.RefundCreateParams = {
      payment_intent: transactionId,
      ...(partial_amount != null &&
      partial_amount > 0 &&
      !Number.isNaN(partial_amount)
        ? { amount: partial_amount }
        : {}),
      reason: 'requested_by_customer',
    };

    const {
      amount,
      balance_transaction,
      id,
      reason,
      charge,
      currency,
      status,
    } = await this.stripe.refunds.create(paymentRefundPayload);

    return {
      amount,
      balance_transaction: balance_transaction?.toString(),
      charge: charge?.toString(),
      currency,
      id,
      isSuccess: status === 'succeeded',
      reason,
    };
  }
}
