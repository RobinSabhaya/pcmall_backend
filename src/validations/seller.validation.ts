import z from 'zod';

import { sellerSchema } from '../models/user';

import { baseResponseSchema } from './response.validation';

export type CreateUpdateSellerSchema = z.infer<typeof createUpdateSeller.body>;
export type DeleteSellerSchema = z.infer<typeof deleteSeller.query>;
export type GetAllSellersSchema = z.infer<typeof getAllSellers.query>;

export const createUpdateSeller = {
  body: z.object({
    sellerId: z.string().optional(),
    password: z.string(),
    confirm_password: z.string(),
    name: z.string().optional(),
    businessEmail: z.string().optional(),
    businessName: z.string().optional(),
    gstNumber: z.string().optional(),
  }),
  response: baseResponseSchema({ data: { sellerData: sellerSchema } }),
};

export const deleteSeller = {
  query: z.object({
    sellerId: z.string(),
  }),
  response: baseResponseSchema({ data: { sellerData: sellerSchema } }),
};

export const getAllSellers = {
  query: z.object({}),
  response: baseResponseSchema({ data: { sellerData: sellerSchema } }),
};
