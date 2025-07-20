import z from 'zod'

export type RegisterSchema = z.infer<typeof register>
export type LoginSchema = z.infer<typeof login>
export type LogoutSchema = z.infer<typeof logout>
export type RefreshTokensSchema = z.infer<typeof refreshTokens>
export type ForgotPasswordSchema = z.infer<typeof forgotPassword>
export type ResetPasswordSchema = z.infer<typeof resetPassword>
export type VerifyEmailSchema = z.infer<typeof verifyEmail>

export const register = z.object({
  email: z.string().nonempty("Email is required"),
  password: z.string(),
  confirm_password: z.string(),
  first_name: z.string()
})

export const login = z.object({
  email: z.string().nonempty("Email is required"),
  password: z.string(),
})

export const logout = z.object({
  refreshToken: z.string()
});

export const refreshTokens = z.object({
  refreshToken: z.string()
})

export const forgotPassword = z.object({
  email: z.string()
});

export const resetPassword = z.object({
  token: z.string(),
  password: z.string()
})

export const verifyEmail = z.object({
  token: z.string()
})