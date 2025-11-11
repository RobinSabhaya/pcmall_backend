import z from 'zod';

export const timestampSchema = {
  createdAt: z.string(),
  updatedAt: z.string(),
};

export const paginationSchema = (subSchema: z.ZodType): z.ZodType =>
  z.object({
    results: z.array(subSchema),
    totalResults: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  });
