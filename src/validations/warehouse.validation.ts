import z from 'zod';

export type CreateUpdateWarehouseSchema = z.infer<typeof createUpdateWarehouse.body>;
export type DeleteWarehouseSchema = z.infer<typeof deleteWarehouse.query>;
export type GetAllWarehouseSchema = z.infer<typeof getAllWarehouse.query>;

export const createUpdateWarehouse = {
  body: z.object({
    name: z.string().optional(),
    warehouseId: z.string().optional(),
    sellerId: z.string().optional(),
    addressId: z.string().optional(),
  }),
};

export const deleteWarehouse = {
  query: z.object({
    warehouseId: z.string(),
  }),
};

export const getAllWarehouse = {
  query: z.object({}),
};
