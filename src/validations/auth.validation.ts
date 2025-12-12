import z from 'zod';

import { userSchema } from '../models/user';
import { mongooseToZod } from '../utils/mongooseToZod';

import {
  baseResponseSchema,
  customResponseSchema,
} from './response.validation';

export type RegisterSchema = z.infer<typeof register.body>;
export type SignupSchema = z.infer<typeof signup.body>;
export type LoginSchema = z.infer<typeof login.body>;
export type LogoutSchema = z.infer<typeof logout.body>;
export type RefreshTokensSchema = z.infer<typeof refreshTokens.body>;
export type ForgotPasswordSchema = z.infer<typeof forgotPassword.query>;
export type ResetPasswordSchema = z.infer<typeof resetPassword>;
export type VerifyEmailSchema = z.infer<typeof verifyEmail>;

export const tokenZodSchema = z.object({
  tokens: z.object({
    access: z.object({ token: z.string(), expires: z.string() }),
    refresh: z.object({ token: z.string(), expires: z.string() }),
  }),
});

export const register = {
  body: z.object({
    email: z.string().nonempty('Email is required'),
    password: z.string(),
    confirm_password: z.string(),
    first_name: z.string(),
  }),
  response: baseResponseSchema({ data: { user: userSchema } }),
};

export const signup = {
  body: z.object({
    email: z.string().nonempty('Email is required'),
    password: z.string(),
    confirm_password: z.string(),
    first_name: z.string(),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      user: mongooseToZod(userSchema),
      tokens: tokenZodSchema,
    }),
  }),
};

export const login = {
  body: z.object({
    email: z.string().nonempty('Email is required'),
    password: z.string(),
  }),
  response: customResponseSchema({
    zodSchema: tokenZodSchema,
  }),
};

export const logout = {
  body: z.object({
    refreshToken: z.string(),
  }),
};

export const refreshTokens = {
  body: z.object({
    // refreshToken: z.string(),
  }),
  response: customResponseSchema({
    zodSchema: tokenZodSchema,
  }),
};

export const forgotPassword = {
  query: z.object({
    email: z.string(),
  }),
};

export const resetPassword = z.object({
  token: z.string(),
  password: z.string(),
});

export const verifyEmail = z.object({
  token: z.string(),
});
