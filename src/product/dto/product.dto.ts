import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const createUpdateProductSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  name: z.string().optional(),
  attributeCombination: z
    .object({
      size: z.string().optional(),
    })
    .optional(),
  images: z.array(z.string()).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  brand: z.string().optional(),
  modelNumber: z.string().optional(),
  tags: z.array(z.string()),
  category: z.string(),
});

export const deleteProductSchema = z.object({
  productId: z.string().optional(),
});

export const getAllProductsSchema = z.object({
  categories: z.string().optional(),
  colors: z.string().optional(),
  prices: z.string().optional(),
  gender: z.string().optional(),
  productId: z.string().optional(),
  slug: z.string().optional(),
  search: z.string().optional(),
  page: z.string().default('1').optional(),
  limit: z.string().default('10').optional(),
  sortBy: z.string().optional(),
});

// DTOs
export class CreateUpdateProductDto extends createZodDto(
  createUpdateProductSchema,
) {}
export class DeleteProductDto extends createZodDto(deleteProductSchema) {}
export class GetAllProductsDto extends createZodDto(getAllProductsSchema) {}
