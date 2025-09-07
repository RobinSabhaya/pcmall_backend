import z from 'zod';

import { warehouseSchema } from '../models/warehouse';

import { baseResponseSchema } from './response.validation';

export type CreateUpdateWarehouseSchema = z.infer<
  typeof createUpdateWarehouse.body
>;
export type DeleteWarehouseSchema = z.infer<typeof deleteWarehouse.query>;
export type GetAllWarehouseSchema = z.infer<typeof getAllWarehouse.query>;

export const createUpdateWarehouse = {
  body: z.object({
    name: z.string().optional(),
    warehouseId: z.string().optional(),
    sellerId: z.string().optional(),
    addressId: z.string().optional(),
  }),
  response: baseResponseSchema({ data: { warehouseData: warehouseSchema } }),
};

export const deleteWarehouse = {
  query: z.object({
    warehouseId: z.string(),
  }),
  response: baseResponseSchema({ data: { warehouseData: warehouseSchema } }),
};

export const getAllWarehouse = {
  query: z.object({}),
  response: baseResponseSchema({ data: { warehouseData: warehouseSchema } }),
};
