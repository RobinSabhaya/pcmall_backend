import z from 'zod';

import { customResponseSchema } from './response.validation';

export type CheckoutSchema = z.infer<typeof checkout.body>;

export const checkout = {
  body: z.object({
    items: z.array(
      z.object({
        quantity: z.number(),
        product_name: z.string(),
        unit_amount: z.number(),
        productVariantId: z.string(),
      })
    ),
    currency: z.string(),
    shippingAddress: z.string(),
    shippoShipmentId: z.string(),
    rateObjectId: z.string(),
    cartIds: z.array(z.string()),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      checkoutUrl: z.string(),
    }),
  }),
};
