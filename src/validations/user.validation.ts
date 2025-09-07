import z from 'zod';

import { addressSchema, userSchema } from '../models/user';

import { baseResponseSchema } from './response.validation';

export type GetUserSchema = z.infer<typeof getUser.query>;
export type UpdateUserSchema = z.infer<typeof updateUser.body>;
export type DeleteUserSchema = z.infer<typeof deleteUser.query>;
export type UpdateAddressSchema = z.infer<typeof updateAddress.body>;
export type DeleteAddressSchema = z.infer<typeof deleteAddress.query>;

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
    // dob: z.date().optional(),
    gender: z.string().optional(),
    language: z.string().optional(),
  }),
  response: baseResponseSchema({ data: { userData: userSchema } }),
};

export const deleteUser = {
  query: z.object({
    userId: z.string(),
  }),
  response: baseResponseSchema({ data: { userData: userSchema } }),
};

export const updateAddress = {
  body: z.object({
    addressId: z.string(),
    line1: z.string().optional(),
    line2: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  }),
  response: baseResponseSchema({ data: { addressData: addressSchema } }),
};

export const deleteAddress = {
  query: z.object({
    addressId: z.string(),
  }),
  response: baseResponseSchema({ data: { addressData: addressSchema } }),
};
