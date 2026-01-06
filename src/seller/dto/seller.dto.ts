import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const createUpdateSellerSchema = z.object({
  sellerId: z.string().optional(),
  password: z.string().optional(),
  confirm_password: z.string().optional(),
  name: z.string().optional(),
  businessEmail: z.string().optional(),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
});

export const deleteSellerSchema = z.object({
  sellerId: z.string(),
});

// DTOs
export class CreateUpdateSellerDto extends createZodDto(
  createUpdateSellerSchema,
) {}
export class DeleteSellerDto extends createZodDto(deleteSellerSchema) {}
