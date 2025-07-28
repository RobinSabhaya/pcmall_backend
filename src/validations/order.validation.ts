import z from 'zod';

export type GetOrderListSchema = z.infer<typeof getOrderList.query>;

export const getOrderList = {
  query: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    sortBy: z.string().optional(),
  }),
};
