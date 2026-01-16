import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const createUpdateInventorySchema = z.object({
  inventoryId: z.string().optional(),
  skuId: z.string().optional(),
  warehouseId: z.string().optional(),
  stock: z.number().optional(),
  reserved: z.number().optional(),
  inbound: z.number().optional(),
  outbound: z.number().optional(),
});

export const deleteInventorySchema = z.object({
  inventoryId: z.string(),
});

// DTOs
export class CreateUpdateInventoryDto extends createZodDto(
  createUpdateInventorySchema,
) {}
export class DeleteInventoryDto extends createZodDto(deleteInventorySchema) {}
