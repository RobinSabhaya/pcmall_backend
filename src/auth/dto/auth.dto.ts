import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// Schema
export const RegisterSchema = z.object({
  first_name: z.string(),
  email: z.email(),
  password: z.string(),
  confirm_password: z.string(),
});

export const SignupSchema = z.object({
  first_name: z.string(),
  email: z.email(),
  password: z.string(),
  confirm_password: z.string(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

// DTO
export class RegisterDto extends createZodDto(RegisterSchema) {}

export class SignupDto extends createZodDto(SignupSchema) {}

export class LoginDto extends createZodDto(LoginSchema) {}
