import z from 'zod';

export type CreateUpdateRatingSchema = z.infer<typeof createUpdateRating.body>;
export type GetRatingListSchema = z.infer<typeof getRatingList.query>;
export type GetRatingCountSchema = z.infer<typeof getRatingCount.query>;
export type DeleteRatingSchema = z.infer<typeof deleteRating.query>;

export const createUpdateRating = {
  body: z.object({
    productId: z.string().optional(),
    rating: z.string().optional(),
    message: z.string().optional(),
    ratingId: z.string().optional(),
    images: z.array(z.string().optional()).optional(),
  }),
};

export const deleteRating = {
  query: z.object({
    ratingId: z.string(),
  }),
};

export const getRatingList = {
  query: z.object({
    productId: z.string().optional(),
    rating: z.string().optional(),
  }),
};

export const getRatingCount = {
  query: z.object({
    productId: z.string().optional(),
    rating: z.string().optional(),
  }),
};
