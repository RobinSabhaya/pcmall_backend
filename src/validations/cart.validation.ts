import z from 'zod';

import { cartSchema } from '../models/cart';

import { baseResponseSchema } from './response.validation';

export type AddToCartSchema = z.infer<typeof addToCart.body>;
export type UpdateToCartSchema = z.infer<typeof updateToCart.body>;
export type RemoveToCartSchema = z.infer<typeof removeToCart.params>;
export type GetAllCartSchema = z.infer<typeof getAllCart.query>;

export const addToCart = {
  body: z.object({
    productVariantId: z.string(),
    quantity: z.number(),
  }),
  response: baseResponseSchema({ data: { cartData: cartSchema } }),
};

export const updateToCart = {
  body: z.object({
    cartId: z.string(),
    quantity: z.number(),
  }),
  response: baseResponseSchema({ data: { cartData: cartSchema } }),
};

export const removeToCart = {
  params: z.object({
    cartId: z.string(),
  }),
  response: baseResponseSchema({ data: { cartData: cartSchema } }),
};

export const getAllCart = {
  query: z.object({}),
  // TODO : handle nested schema
  // response: customResponseSchema({
  //   zodSchema: z.object({
  //     ...createPaginatedResponseSchema(mongooseToZod(cartSchema)),
  //     totalQty: z.number(),
  //   }),
  // }),
};
