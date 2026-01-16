import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const createUpdateAddressSchema = z.object({
  addressId: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
});

export const deleteAddressSchema = z.object({
  addressId: z.string(),
});

// DTOs
export class CreateUpdateAddressDto extends createZodDto(
  createUpdateAddressSchema,
) {}
export class DeleteAddressDto extends createZodDto(deleteAddressSchema) {}
