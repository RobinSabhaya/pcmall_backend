import z from 'zod';

import { brandSchema } from '../models/product';

import { baseResponseSchema } from './response.validation';

export type CreateUpdateBrandSchema = z.infer<typeof createUpdateBrand.body>;
export type DeleteBrandSchema = z.infer<typeof deleteBrand.query>;
export type GetAllBrandsSchema = z.infer<typeof getAllBrands.query>;

export const createUpdateBrand = {
  body: z.object({
    brandId: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
    slug: z.string().optional(),
    logo: z.string().optional(),
    bannerImage: z.string().optional(),
    contactEmail: z.string().optional(),
    headquarters: z.string().optional(),
    foundedYear: z.number().optional(),
    founder: z.string().optional(),
    ceo: z.string().optional(),
    isFeatured: z.boolean().optional(),
  }),
  response: baseResponseSchema({ data: { brandData: brandSchema } }),
};

export const deleteBrand = {
  query: z.object({
    brandId: z.string().optional(),
  }),
  response: baseResponseSchema({ data: { brandData: brandSchema } }),
};

export const getAllBrands = { query: z.object({}) };
