import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const createUpdateWarehouseSchema = z.object({
  name: z.string().optional(),
  warehouseId: z.string().optional(),
  sellerId: z.string().optional(),
  addressId: z.string().optional(),
});

export const deleteWarehouseSchema = z.object({
  warehouseId: z.string(),
});

// DTOs
export class CreateUpdateWarehouseDto extends createZodDto(
  createUpdateWarehouseSchema,
) {}
export class DeleteWarehouseDto extends createZodDto(deleteWarehouseSchema) {}
