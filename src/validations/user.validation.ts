import z from "zod";

export type GetUserSchema = z.infer<typeof getUser>;
export type UpdateUserSchema = z.infer<typeof updateUser>;
export type DeleteUserSchema = z.infer<typeof deleteUser>;
export type UpdateAddressSchema = z.infer<typeof updateAddress>;
export type DeleteAddressSchema = z.infer<typeof deleteAddress>;

export const getUser = z.object({
  userId: z.string(),
});

export const updateUser = z.object({
  line1: z.string(),
  line2: z.string(),
  state: z.string(),
  city: z.string(),
  country: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  dob: z.date(),
  gender: z.string(),
  language: z.string(),
});

export const deleteUser = z.object({
  userId: z.string(),
});

export const updateAddress = z.object({
_id : z.string(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

export const deleteAddress = z.object({
_id : z.string(),
})
