import { ICheckoutItemResponse } from '../payment.interface';

export interface ICreateCheckoutSession {
  userId: string;
  orderId: string;
  lineItems: ICheckoutItemResponse[];
  email: string;
  cartIds: string[];
}

export interface ICreateCheckoutSessionResponse {
  checkoutUrl: string | null;
  sessionId: string;
}

export interface ICreateRefundResponse {
  id: string;
  charge: string | undefined;
  balance_transaction: string | undefined;
  amount: number;
  currency: string;
  reason: string | null;
  isSuccess: boolean;
}
