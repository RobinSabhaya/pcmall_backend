import { StatusCodeReply } from 'fastify/types/utils';
import { z } from 'zod';
import { JSONSchema } from 'zod/v4/core';

export function getExampleFromSchema(
  schema: JSONSchema.BaseSchema
): Record<string, string> {
  const example: Record<string, string> = {};
  for (const [key, value] of Object.entries(
    schema.properties as Record<string, JSONSchema.BaseSchema>
  )) {
    example[key] = value.type ?? 'unknown';
  }
  return example;
}

// Helper function to convert Zod schema to proper OpenAPI schema
export function zodToOpenApiSchema(
  zodSchema: z.ZodSchema
): JSONSchema.BaseSchema {
  const jsonSchema = z.toJSONSchema(zodSchema);

  // Remove Zod-specific properties and convert to OpenAPI format
  function cleanSchema(schema: JSONSchema.BaseSchema): JSONSchema.BaseSchema {
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    // Remove Zod-specific properties
    const cleaned = { ...schema };
    delete cleaned['~standard'];
    delete cleaned['def'];

    // Handle object properties
    if (cleaned.properties) {
      const newProperties: Record<string, JSONSchema.BaseSchema> = {};
      for (const [key, value] of Object.entries(cleaned.properties)) {
        newProperties[key] = cleanSchema(value as JSONSchema.BaseSchema);
      }
      cleaned.properties = newProperties;
    }

    // Handle array items
    if (cleaned.items !== null) {
      cleaned.items = cleanSchema(cleaned.items as JSONSchema.BaseSchema);
    }

    // Handle oneOf, anyOf, allOf
    ['oneOf', 'anyOf', 'allOf'].forEach(key => {
      if (cleaned[key] !== null && Array.isArray(cleaned[key])) {
        cleaned[key] = cleaned[key].map((item: JSONSchema.BaseSchema) =>
          cleanSchema(item)
        );
      }
    });

    return cleaned;
  }

  return cleanSchema(jsonSchema);
}

export const createSuccessSchema = (): z.ZodSchema =>
  z.object({
    success: z.boolean().default(true),
    message: z.string().optional(),
    data: z.object(),
  });

export const createErrorSchema = (): z.ZodSchema =>
  z.object({
    success: z.boolean().default(false),
    message: z.string(),
  });

export const createPaginatedSchema = (): z.ZodSchema =>
  z.object({
    success: z.boolean().default(true),
    data: z.object({
      results: z
        .object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        })
        .optional(),
    }),
  });

export const createStandardResponses = (
  statusCode: StatusCodeReply
): z.ZodSchema => {
  if (statusCode === statusCode[200] || statusCode === statusCode[201]) {
    return createSuccessSchema();
  }

  return createErrorSchema();
};
