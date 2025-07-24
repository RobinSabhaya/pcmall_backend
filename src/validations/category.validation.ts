import z from 'zod';

export type AllCategorySchema = z.infer<typeof allCategory.query>;

export const allCategory = {
  query: z.object({}),
};
