import z from 'zod';

import { productSchema, sKUSchema, variantSchema } from '../models/product';
import { mongooseToZod } from '../utils/mongooseToZod';

import {
  baseResponseSchema,
  customResponseSchema,
} from './response.validation';

export type CreateUpdateProductSchema = z.infer<
  typeof createUpdateProduct.body
>;
export type DeleteProductSchema = z.infer<typeof deleteProduct.query>;
export type GetAllProductsSchema = z.infer<typeof getAllProducts.query>;
export type GenerateProductSkuSchema = z.infer<typeof generateProductSku.body>;

export const createUpdateProduct = {
  body: z.object({
    productId: z.string().optional(),
    variantId: z.string().optional(),
    name: z.string().optional(),
    attributeCombination: z.object().optional(),
    images: z.array(z.string()).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    slug: z.string().optional(),
    brand: z.string().optional(),
    modelNumber: z.string().optional(),
    tags: z.array(z.string()),
    category: z.string(),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      productData: mongooseToZod(productSchema),
      productVariantData: mongooseToZod(variantSchema),
    }),
  }),
};

export const deleteProduct = {
  query: z.object({
    productId: z.string().optional(),
  }),
  response: baseResponseSchema({ data: { productData: productSchema } }),
};

export const getAllProducts = {
  query: z.object({
    categories: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    prices: z.object().optional(),
    productId: z.string().optional(),
  }),
  // TODO : need to handle without ref schema and also nested ref schema
  // response: baseResponseSchema({
  //   isPagination: true,
  //   data: { productData: productSchema },
  //   populatedSchemas : {
  //     Product_Brand : brandSchema,
  //     Category : categorySchema,
  //     Product_Variant : variantSchema
  //   }
  // }),
};

export const generateProductSku = {
  body: z.object({
    variantId: z.string(),
    productSkuId: z.string().optional(),
    price: z.number().optional(),
    discount: z.number().optional(),
    tax: z.number().optional(),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      productData: mongooseToZod(productSchema),
      productSkuData: mongooseToZod(sKUSchema),
    }),
  }),
};
