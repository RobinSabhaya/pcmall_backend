import z from 'zod';

import { categorySchema } from '../models/category';
import { mongooseToZod } from '../utils/mongooseToZod';

import { customResponseSchema } from './response.validation';

export type AllCategorySchema = z.infer<typeof allCategory.query>;

export const allCategory = {
  query: z.object({}),
  response: customResponseSchema({
    zodSchema: z.object({
      categoryData: z.array(mongooseToZod(categorySchema)),
    }),
  }),
};
