import z from 'zod';

import { orderSchema } from '../models/orders';

import { baseResponseSchema } from './response.validation';

export type GetOrderListSchema = z.infer<typeof getOrderList.query>;

export const getOrderList = {
  query: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    sortBy: z.string().optional(),
  }),
  response: baseResponseSchema({ data: { ordersData: orderSchema } }),
};
