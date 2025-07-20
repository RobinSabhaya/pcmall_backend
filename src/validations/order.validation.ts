import z from 'zod'

export type GetOrderListSchema = z.infer<typeof getOrderList>

export const getOrderList = z.object({
   
})
