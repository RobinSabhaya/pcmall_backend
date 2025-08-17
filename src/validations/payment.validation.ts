import z from 'zod';

export type CreatePaymentRefundSchema = z.infer<
  typeof createPaymentRefund.body
>;

export const createPaymentRefund = {
  body: z.object({
    transactionId: z.string(),
    reason: z.string().optional(),
    partial_amount: z.number().optional(),
  }),
};
