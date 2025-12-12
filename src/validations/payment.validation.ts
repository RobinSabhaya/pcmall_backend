import z from 'zod';

import { paymentSchema } from '../models/payment';

import { baseResponseSchema } from './response.validation';

export type CreatePaymentRefundSchema = z.infer<
  typeof createPaymentRefund.body
>;

export type GetPaymentDetailsSchema = z.infer<typeof getPaymentDetails.query>;

export const createPaymentRefund = {
  body: z.object({
    transactionId: z.string(),
    reason: z.string().optional(),
    partial_amount: z.number().optional(),
  }),
  response: baseResponseSchema({ data: { paymentData: paymentSchema } }),
};

export const getPaymentDetails = {
  query: z.object({
    sessionId: z.string(),
  }),
};
