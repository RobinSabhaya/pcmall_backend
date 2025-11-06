import z from 'zod';

import { ratingSchema } from '../models/rating';

import { baseResponseSchema } from './response.validation';

export type CreateUpdateRatingSchema = z.infer<typeof createUpdateRating.body>;
export type GetRatingListSchema = z.infer<typeof getRatingList.query>;
export type GetRatingCountSchema = z.infer<typeof getRatingCount.query>;
export type DeleteRatingSchema = z.infer<typeof deleteRating.query>;

// TODO: need to check response validation
export const createUpdateRating = {
  body: z.object({
    productId: z.string().optional(),
    rating: z.number().optional(),
    message: z.string().optional(),
    ratingId: z.string().optional(),
    images: z.array(z.string().optional()).optional(),
  }),
  // response: baseResponseSchema({ data: { ratingData: ratingSchema } }),
};

export const deleteRating = {
  query: z.object({
    ratingId: z.string(),
  }),
  response: baseResponseSchema({ data: { ratingData: ratingSchema } }),
};

export const getRatingList = {
  query: z.object({
    productId: z.string().optional(),
    rating: z.string().optional(),
  }),
  // response: baseResponseSchema({
  //   isPagination: true,
  //   data: { ratingData: ratingSchema },
  // }),
};

export const getRatingCount = {
  query: z.object({
    productId: z.string().optional(),
    rating: z.string().optional(),
  }),
  // response: baseResponseSchema({ data: { ratingCount: ratingSchema } }),
};
