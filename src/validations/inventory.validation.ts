import z from 'zod';

import { inventorySchema } from '../models/inventory';
import { mongooseToZod } from '../utils/mongooseToZod';

import {
  baseResponseSchema,
  customResponseSchema,
} from './response.validation';

export type CreateUpdateInventorySchema = z.infer<
  typeof createUpdateInventory.body
>;
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
  response: baseResponseSchema({ data: { inventoryData: inventorySchema } }),
};

export const deleteInventory = {
  query: z.object({
    inventoryId: z.string(),
  }),
  response: baseResponseSchema({ data: { inventoryData: inventorySchema } }),
};

export const getAllInventory = {
  query: z.object({}),
  response: customResponseSchema({
    zodSchema: z.object({
      inventoryData: mongooseToZod(inventorySchema),
    }),
  }),
};
