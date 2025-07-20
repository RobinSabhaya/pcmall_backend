import z from 'zod'

export type CheckoutSchema = z.infer<typeof checkout>

export const checkout = z.object({
    items: z.array(z.object(
        {
            quantity: z.number(),
            product_name: z.string(),
            unit_amount: z.number(),
            productVariantId: z.string()
        }
    )),
    currency: z.string(),
    shippingAddress: z.string(),
    shippoShipmentId: z.string(),
    rateObjectId: z.string(),
    cartIds: z.array(z.string())
})
