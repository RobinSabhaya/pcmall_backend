import z from 'zod'

export type CreateUpdateWishlistSchema = z.infer<typeof createUpdateWishlist>

export const createUpdateWishlist = {
    body: z.object({
        productId: z.string()
    })
}
