import z from 'zod'

export type AllCategorySchema = z.infer<typeof allCategory>

export const allCategory = z.object({
})
