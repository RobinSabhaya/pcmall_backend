import z from 'zod';

export type GenerateFileUploadSchema = z.infer<typeof generateFileUpload.body>;

export const generateFileUpload = {
  body: z.object({
    fileName: z.string(),
  }),
};
