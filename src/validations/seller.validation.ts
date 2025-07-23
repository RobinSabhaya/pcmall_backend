import z from 'zod'

export type CreateUpdateSellerSchema = z.infer<typeof createUpdateSeller.body>
export type DeleteSellerSchema = z.infer<typeof deleteSeller.query>
export type GetAllSellersSchema = z.infer<typeof getAllSellers.query>

export const createUpdateSeller = {body : z.object({
    sellerId: z.string().optional(),
    password: z.string(),
    confirm_password: z.string(),
    name: z.string().optional(),
    businessEmail: z.string().optional(),
    businessName: z.string().optional(),
    gstNumber: z.string().optional(),
})}

export const deleteSeller = {
    query : z.object({
    sellerId : z.string()
})
}

export const getAllSellers = {
    query : z.object({

})
}
