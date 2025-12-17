import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const createUpdateProductSchema = z.object({
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
});

// DTOs
export class CreateUpdateProductDto extends createZodDto(
  createUpdateProductSchema,
) {}
