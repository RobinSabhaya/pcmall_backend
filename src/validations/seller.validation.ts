import z from 'zod'

export type CreateUpdateSellerSchema = z.infer<typeof createUpdateSeller>
export type DeleteSellerSchema = z.infer<typeof deleteSeller>
export type GetAllSellersSchema = z.infer<typeof getAllSellers>

export const createUpdateSeller = z.object({
    sellerId: z.string(),
    password: z.string(),
    confirm_password: z.string(),
    name: z.string().optional(),
    businessEmail: z.string().optional(),
    businessName: z.string().optional(),
    gstNumber: z.string().optional(),
})

export const deleteSeller = z.object({
    sellerId : z.string()
})

export const getAllSellers = z.object({

});
