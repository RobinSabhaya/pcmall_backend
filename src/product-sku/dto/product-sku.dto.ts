import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schema
export const generateProductSkuSchema = z.object({
  variantId: z.string(),
  productSkuId: z.string().optional(),
  price: z.number().optional(),
  discount: z.number().optional(),
  tax: z.number().optional(),
});

// DTO
export class GenerateProductSkuDto extends createZodDto(
  generateProductSkuSchema,
) {}
