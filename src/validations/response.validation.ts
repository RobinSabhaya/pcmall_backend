import { Schema } from 'mongoose';
import z from 'zod';

import {
  createSchemaWithRefs,
  IRefOptions,
  mongooseToZod,
  ZodFieldsRecord,
} from '../utils/mongooseToZod';

// types
export type ResponseDataType = Record<string, z.ZodObject<ZodFieldsRecord>>;

export interface IBaseResponse extends IRefOptions {
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
    200: z.toJSONSchema(
      z.object({
        success: z.boolean().default(true),
        message: z.string().optional(),
        data: z.object(responseData),
      })
    ),
  };
};

export const createResponseSchema = (data: Record<string, Schema>): object => {
  const responseData: ResponseDataType = {};

  for (const [keys, values] of Object.entries(data)) {
    responseData[keys] = mongooseToZod(values);
  }

  return {
    201: z.object({
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
    400: errorZodSchema,
    404: errorZodSchema,
    500: errorZodSchema,
    401: errorZodSchema,
  };
};

export const createPaginatedResponseSchema = (
  dataSchema: z.ZodObject<ZodFieldsRecord>,
  dataKey: string
): object => {
  return {
    200: z.object({
      success: z.boolean().default(true),
      data: z.object({
        [dataKey]: z.object({
          results: z.array(dataSchema),
          page: z.number(),
          limit: z.number(),
          totalResults: z.number(),
          totalPages: z.number(),
        }),
      }),
    }),
  };
};

export const baseResponseSchema = ({
  isPagination = false,
  data,
  populatedSchemas = {},
}: IBaseResponse): { [statusCode: number]: z.ZodAny } => {
  const [key] = Object.entries(data);
  return {
    // success
    ...createSuccessResponseSchema(data),
    // create
    ...createResponseSchema(data),
    // error
    ...createErrorResponseSchema(),
    // pagination
    ...(isPagination &&
      createPaginatedResponseSchema(
        createSchemaWithRefs(key[1], populatedSchemas),
        key[0]
      )),
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
    200: z.object({
      success: z.boolean().default(true),
      message: z.string().optional(),
      data: zodSchema,
    }),
  };
};
