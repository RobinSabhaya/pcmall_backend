import z from 'zod';

export type CreateUpdateInventorySchema = z.infer<typeof createUpdateInventory.body>;
export type DeleteInventorySchema = z.infer<typeof deleteInventory.query>;
export type GetAllInventorySchema = z.infer<typeof getAllInventory.query>;

export const createUpdateInventory = {
  body: z.object({
    inventoryId: z.string().optional(),
    skuId: z.string().optional(),
    warehouseId: z.string().optional(),
    stock: z.number().optional(),
    reserved: z.number().optional(),
    inbound: z.number().optional(),
    outbound: z.number().optional(),
  }),
};

export const deleteInventory = {
  query: z.object({
    inventoryId: z.string(),
  }),
};

export const getAllInventory = { query: z.object({}) };
