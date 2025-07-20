import z from 'zod'

export type AddToCartSchema = z.infer<typeof addToCart>
export type UpdateToCartSchema = z.infer<typeof updateToCart>
export type getAllCartSchema = z.infer<typeof getAllCart>

export const addToCart = z.object({
    productVariantId: z.string(),
    quantity: z.number()
})

export const updateToCart = z.object({
    cartId: z.string(),
    quantity : z.number()
})

export const getAllCart = z.object({
    
});
