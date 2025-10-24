import z from 'zod';

import { orderSchema } from '../models/orders';
import { mongooseToZod } from '../utils/mongooseToZod';

import { customResponseSchema } from './response.validation';

export type GetOrderListSchema = z.infer<typeof getOrderList.query>;

export const getOrderList = {
  query: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    sortBy: z.string().optional(),
    status: z.string().optional(),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      orderData: z.object({
        results: z.array(z.object(mongooseToZod(orderSchema))),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        totalResults: z.number(),
      }),
    }),
  }),
};
