import { Injectable } from '@nestjs/common';

import { CreateRefundDto } from '../dto/payment.dto';
import { PaymentProvider } from '../enums/payment.enum';

import { StripeStrategy } from './stripe.strategy';
import {
  ICreateCheckoutSession,
  ICreateCheckoutSessionResponse,
  ICreateRefundResponse,
} from './stripe.strategy.interface';

export interface IPaymentStrategy {
  createCheckoutSession(
    payload: ICreateCheckoutSession,
  ): Promise<ICreateCheckoutSessionResponse>;
  createPaymentRefund(payload: CreateRefundDto): Promise<ICreateRefundResponse>;
}

@Injectable()
export class PaymentStrategy {
  constructor(private readonly stripe: StripeStrategy) {}

  getPaymentStrategy(provider: PaymentProvider): IPaymentStrategy {
    // TODO: do better way
    if (provider === PaymentProvider.STRIPE) {
      return this.stripe;
    } else {
      throw new Error('Unsupported payment provider');
    }
  }
}
