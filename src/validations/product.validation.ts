import z from "zod";

export type CreateUpdateProductSchema = z.infer<
  typeof createUpdateProduct.body
>;
export type DeleteProductSchema = z.infer<typeof deleteProduct.query>;
export type GetAllProductsSchema = z.infer<typeof getAllProducts.query>;
export type GenerateProductSkuSchema = z.infer<typeof generateProductSku.body>;

export const createUpdateProduct = {
  body: z.object({
    productId: z.string().optional(),
    variantId: z.string().optional(),
    name: z.string().optional(),
    attributeCombination: z.object().optional(),
    images: z.array(z.string()).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    slug: z.string().optional(),
    brand: z.string().optional(),
    modelNumber: z.string().optional(),
    tags: z.array(z.string()),
  }),
};

export const deleteProduct = {
  query: z.object({
    productId: z.string().optional(),
  }),
};

export const getAllProducts = {
  query: z.object({
    categories: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    prices: z.object().optional(),
    productId: z.string().optional(),
  }),
};

export const generateProductSku = {
  body: z.object({
    variantId: z.string().optional(),
    productSkuId: z.string().optional(),
    price: z.number().optional(),
    discount: z.string().optional(),
    tax: z.string().optional(),
  }),
};
