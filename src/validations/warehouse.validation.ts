import z from 'zod';

import { warehouseSchema } from '../models/warehouse';
import { mongooseToZod } from '../utils/mongooseToZod';

import { customResponseSchema } from './response.validation';

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
  response: customResponseSchema({
    zodSchema: z.object({
      warehouseData: mongooseToZod(warehouseSchema),
    }),
  }),
};

export const deleteWarehouse = {
  query: z.object({
    warehouseId: z.string(),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      warehouseData: mongooseToZod(warehouseSchema),
    }),
  }),
};

export const getAllWarehouse = {
  query: z.object({}),
  response: customResponseSchema({
    zodSchema: z.object({
      warehouseData: z.array(mongooseToZod(warehouseSchema)),
    }),
  }),
};
