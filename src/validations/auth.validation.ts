import z from 'zod';

export type RegisterSchema = z.infer<typeof register.body>;
export type LoginSchema = z.infer<typeof login.body>;
export type LogoutSchema = z.infer<typeof logout.body>;
export type RefreshTokensSchema = z.infer<typeof refreshTokens.body>;
export type ForgotPasswordSchema = z.infer<typeof forgotPassword.query>;
export type ResetPasswordSchema = z.infer<typeof resetPassword>;
export type VerifyEmailSchema = z.infer<typeof verifyEmail>;

export const register = {
  body: z.object({
    email: z.string().nonempty('Email is required'),
    password: z.string(),
    confirm_password: z.string(),
    first_name: z.string(),
  }),
};

export const login = {
  body: z.object({
    email: z.string().nonempty('Email is required'),
    password: z.string(),
  }),
};

export const logout = {
  body: z.object({
    refreshToken: z.string(),
  }),
};

export const refreshTokens = {
  body: z.object({
    refreshToken: z.string(),
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
