import z from 'zod';

import { paymentSchema } from '../models/payment';

import { baseResponseSchema } from './response.validation';

export type CreatePaymentRefundSchema = z.infer<
  typeof createPaymentRefund.body
>;

export const createPaymentRefund = {
  body: z.object({
    transactionId: z.string(),
    reason: z.string().optional(),
    partial_amount: z.number().optional(),
  }),
  response: baseResponseSchema({ data: { paymentData: paymentSchema } }),
};
