import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createUpdateBrandSchema = z.object({
  brandId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  slug: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().optional(),
  bannerImage: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  headquarters: z.string().optional(),
  foundedYear: z.number().optional(),
  founder: z.string().optional(),
  ceo: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.string().optional(),
});

export const deleteBrandSchema = z.object({
  brandId: z.string().optional(),
});

export class CreateUpdateBrandDto extends createZodDto(
  createUpdateBrandSchema,
) {}
export class DeleteBrandDto extends createZodDto(deleteBrandSchema) {}
