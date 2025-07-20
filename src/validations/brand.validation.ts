import z from 'zod'

export type createUpdateBrandSchema = z.infer<typeof createUpdateBrand>
export type GetAllBrandsSchema = z.infer<typeof getAllBrands>

export const createUpdateBrand = z.object({
    brandId: z.string().optional,
    name: z.string().optional(),
    description: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
    slug: z.string().optional(),
    logo: z.string().optional(),
    bannerImage: z.string().optional(),
    contactEmail: z.string().optional(),
    headquarters: z.string().optional(),
    foundedYear: z.number().optional(),
    founder: z.string().optional(),
    ceo: z.string().optional(),
    isFeatured: z.boolean().optional(),
  })
export const getAllBrands = z.object({})