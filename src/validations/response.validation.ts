import httpStatus from 'http-status';
import { Schema } from 'mongoose';
import z from 'zod';

import { mongooseToZod, ZodFieldsRecord } from '../utils/mongooseToZod';

// types
export interface IBaseResponse {
  isPagination?: boolean;
  mongooseSchema: Schema;
}

export const createSuccessResponseSchema = (schema: Schema): object => {
  return {
    [httpStatus.OK]: z.object({
      success: z.boolean().default(true),
      message: z.string().optional(),
      data: mongooseToZod(schema),
    }),
  };
};

export const createResponseSchema = (schema: Schema): object => {
  return {
    [httpStatus.CREATED]: z.object({
      success: z.boolean().default(true),
      message: z.string().optional(),
      data: mongooseToZod(schema),
    }),
  };
};

export const createErrorResponseSchema = (): object => {
  const errorZodSchema = z.object({
    success: z.boolean().default(false),
    message: z.string(),
  });
  return {
    [httpStatus.BAD_REQUEST]: errorZodSchema,
    [httpStatus.NOT_FOUND]: errorZodSchema,
    [httpStatus.INTERNAL_SERVER_ERROR]: errorZodSchema,
    [httpStatus.UNAUTHORIZED]: errorZodSchema,
  };
};

export const createPaginatedResponseSchema = (
  dataSchema: z.ZodObject<ZodFieldsRecord>
): object => {
  return {
    [httpStatus.OK]: z.object({
      success: z.boolean().default(true),
      data: z.object({
        results: z.array(dataSchema),
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      }),
    }),
  };
};

export const baseResponseSchema = ({
  isPagination = false,
  mongooseSchema,
}: IBaseResponse): object => {
  return {
    // success
    ...createSuccessResponseSchema(mongooseSchema),
    // create
    ...createResponseSchema(mongooseSchema),
    // error
    ...createErrorResponseSchema(),
    // pagination
    ...(isPagination &&
      createPaginatedResponseSchema(mongooseToZod(mongooseSchema))),
  };
};
