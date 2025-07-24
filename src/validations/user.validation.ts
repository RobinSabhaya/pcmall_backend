import z from 'zod';

export type GetUserSchema = z.infer<typeof getUser.query>;
export type UpdateUserSchema = z.infer<typeof updateUser.body>;
export type DeleteUserSchema = z.infer<typeof deleteUser.query>;
export type UpdateAddressSchema = z.infer<typeof updateAddress.body>;
export type DeleteAddressSchema = z.infer<typeof deleteAddress.params>;

export const getUser = {
  query: z.object({}),
};

export const updateUser = {
  body: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    dob: z.date().optional(),
    gender: z.string().optional(),
    language: z.string().optional(),
  }),
};

export const deleteUser = {
  query: z.object({
    userId: z.string(),
  }),
};

export const updateAddress = {
  body: z.object({
    _id: z.string(),
    line1: z.string().optional(),
    line2: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  }),
};

export const deleteAddress = {
  params: z.object({
    _id: z.string(),
  }),
};
