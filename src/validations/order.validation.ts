import z from 'zod'

export type GetOrderListSchema = z.infer<typeof getOrderList.query>

export const getOrderList = {
    query : z.object({
   
})
}
