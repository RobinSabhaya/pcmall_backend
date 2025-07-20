import z from 'zod'

export type CreateUpdateWarehouseSchema = z.infer<typeof createUpdateWarehouse>
export type DeleteWarehouseSchema = z.infer<typeof deleteWarehouse>
export type GetAllWarehouseSchema = z.infer<typeof getAllWarehouse>

export const createUpdateWarehouse = z.object({
    name: z.string().optional(),
    warehouseId: z.string().optional(),
  sellerId: z.string().optional(),
  addressId: z.string().optional(),
})

export const deleteWarehouse = z.object({
    warehouseId: z.string(),
})

export const getAllWarehouse = z.object({
    
});
