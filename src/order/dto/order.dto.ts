import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const getAllOrdersSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  sortBy: z.string().optional(),
  status: z.string().optional(),
});

// DTOs
export class GetAllOrdersDto extends createZodDto(getAllOrdersSchema) {}
