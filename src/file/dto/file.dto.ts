import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const generateUrlSchema = z.object({
  fileName: z.string(),
});

// DTOs
export class GenerateUrlDto extends createZodDto(generateUrlSchema) {}
