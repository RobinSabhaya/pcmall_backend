import z from 'zod'

export type AddToCartSchema = z.infer<typeof addToCart.body>
export type UpdateToCartSchema = z.infer<typeof updateToCart.body>
export type RemoveToCartSchema = z.infer<typeof removeToCart.params>
export type getAllCartSchema = z.infer<typeof getAllCart.query>

export const addToCart = {
    body : z.object({
    productVariantId: z.string(),
    quantity: z.number()
})
}

export const updateToCart = {body : z.object({
    cartId: z.string(),
    quantity : z.number()
})}

export const removeToCart = {params : z.object({
    cartId: z.string()
})}

export const getAllCart = {
    query : z.object({
    
})
}
