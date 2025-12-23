import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createCheckoutSchema = z.object({
  items: z.array(
    z.object({
      quantity: z.number(),
      product_name: z.string(),
      unit_amount: z.number(),
      productVariantId: z.string(),
    }),
  ),
  currency: z.string(),
  shippingAddress: z.string(),
  cartIds: z.array(z.string()),
});

export const createPaymentRefundSchema = z.object({
  transactionId: z.string(),
  reason: z.string().optional(),
  partial_amount: z.number().optional(),
});

export class CreateCheckoutDto extends createZodDto(createCheckoutSchema) {}
export class CreateRefundDto extends createZodDto(createPaymentRefundSchema) {}
