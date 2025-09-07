import z from 'zod';

import { wishlistSchema } from '../models/wishlist';

import { baseResponseSchema } from './response.validation';

export type CreateUpdateWishlistSchema = z.infer<
  typeof createUpdateWishlist.body
>;

export const createUpdateWishlist = {
  body: z.object({
    productId: z.string(),
  }),
  response: baseResponseSchema({ data: { wishlistData: wishlistSchema } }),
};
