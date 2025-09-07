import z from 'zod';

// import { categorySchema } from '../models/category';

// import { baseResponseSchema } from './response.validation';

export type AllCategorySchema = z.infer<typeof allCategory.query>;

export const allCategory = {
  query: z.object({}),
  // response: baseResponseSchema({data : {categoryData : categorySchema}}) //TODO : Not working
};
