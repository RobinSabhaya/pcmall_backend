import z from 'zod'

export type CreateUpdateInventorySchema = z.infer<typeof createUpdateInventory>
export type DeleteInventorySchema = z.infer<typeof deleteInventory>
export type GetAllInventorySchema = z.infer<typeof getAllInventory>

export const createUpdateInventory = z.object({
    inventoryId : z.string().optional(),
    skuId:z.string().optional(),
    warehouseId: z.string().optional(),
    stock: z.number().optional(),
    reserved: z.number().optional(),
    inbound: z.number().optional(),
    outbound: z.number().optional(),
})

export const deleteInventory = z.object({
    inventoryId : z.string(),
    skuId:z.string(),
    warehouseId:z.string(),
})

export const getAllInventory = z.object({
    
})
