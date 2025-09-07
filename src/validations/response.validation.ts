import httpStatus from 'http-status';
import { Schema } from 'mongoose';
import z from 'zod';

import { mongooseToZod, ZodFieldsRecord } from '../utils/mongooseToZod';

// types
export type ResponseDataType = Record<string, z.ZodObject<ZodFieldsRecord>>;

export interface IBaseResponse {
  isPagination?: boolean;
  data: Record<string, Schema>;
}

export const createSuccessResponseSchema = (
  data: Record<string, Schema>
): object => {
  const responseData: ResponseDataType = {};

  for (const [keys, values] of Object.entries(data)) {
    responseData[keys] = mongooseToZod(values);
  }

  return {
    [httpStatus.OK]: z.object({
      success: z.boolean().default(true),
      message: z.string().optional(),
      data: z.object(responseData),
    }),
  };
};

export const createResponseSchema = (data: Record<string, Schema>): object => {
  const responseData: ResponseDataType = {};

  for (const [keys, values] of Object.entries(data)) {
    responseData[keys] = mongooseToZod(values);
  }

  return {
    [httpStatus.CREATED]: z.object({
      success: z.boolean().default(true),
      message: z.string().optional(),
      data: z.object(responseData),
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
  data,
}: IBaseResponse): { [statusCode: number]: z.ZodTypeAny } => {
  return {
    // success
    ...createSuccessResponseSchema(data),
    // create
    ...createResponseSchema(data),
    // error
    ...createErrorResponseSchema(),
    // pagination
    ...(isPagination &&
      createPaginatedResponseSchema(mongooseToZod(Object.values(data)[0]))),
  };
};

export const customResponseSchema = ({
  zodSchema,
}: {
  zodSchema: z.ZodSchema;
}): { [statusCode: number]: z.ZodTypeAny } => {
  return {
    // error
    ...createErrorResponseSchema(),
    // custom
    [httpStatus.OK]: z.object({
      success: z.boolean().default(true),
      message: z.string().optional(),
      data: zodSchema,
    }),
  };
};
