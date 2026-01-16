import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schemas
export const updateUserSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  language: z.string().optional(),
  profile_picture: z.string().optional(),
});

// DTOs
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
