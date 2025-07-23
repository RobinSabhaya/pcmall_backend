import z from 'zod'

export type CreateUpdateRatingSchema = z.infer<typeof createUpdateRating>
export type GetRatingListSchema = z.infer<typeof getRatingList.query>
export type GetRatingCountSchema = z.infer<typeof getRatingCount.query>

export const createUpdateRating = z.object({
    productId:z.string().optional(),
    rating : z.string().optional(),
    message : z.string().optional(),
    ratingId:z.string().optional(),
})

export const getRatingList = {query : z.object({
    productId:z.string().optional(),
    rating : z.string().optional(),
})}

export const getRatingCount = {query : z.object({
    productId:z.string().optional(),
    rating : z.string().optional(),
})}
