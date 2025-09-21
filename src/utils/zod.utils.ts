import { z } from 'zod';
import { JSONSchema } from 'zod/v4/core';

// Helper function to convert Zod schema to proper OpenAPI schema
export function zodToOpenApiSchema(
  zodSchema: z.ZodSchema
): JSONSchema.BaseSchema {
  // Remove Zod-specific properties and convert to OpenAPI format
  // function cleanSchema(schema: JSONSchema.BaseSchema): JSONSchema.BaseSchema {
  //   if (typeof schema !== 'object' || schema === null) {
  //     return schema;
  //   }

  //   // Remove Zod-specific properties
  //   const cleaned = { ...schema };
  //   delete cleaned['~standard'];
  //   delete cleaned['def'];

  //   // Handle object properties
  //   if (cleaned.properties) {
  //     const newProperties: Record<string, JSONSchema.BaseSchema> = {};
  //     for (const [key, value] of Object.entries(cleaned.properties)) {
  //       newProperties[key] = cleanSchema(value as JSONSchema.BaseSchema);
  //     }
  //     cleaned.properties = newProperties;
  //   }

  //   // Handle array items
  //   if (cleaned.items !== null) {
  //     cleaned.items = cleanSchema(cleaned.items as JSONSchema.BaseSchema);
  //   }

  //   // Handle oneOf, anyOf, allOf
  //   ['oneOf', 'anyOf', 'allOf'].forEach(key => {
  //     if (cleaned[key] !== null && Array.isArray(cleaned[key])) {
  //       cleaned[key] = cleaned[key].map((item: JSONSchema.BaseSchema) =>
  //         cleanSchema(item)
  //       );
  //     }
  //   });

  //   return cleaned;
  // }

  return z.toJSONSchema(zodSchema);
}

export const transformResponseSchemas = (
  response: z.ZodAny
): JSONSchema.BaseSchema => {
  const transformedResponse: Record<string, unknown> = {};

  for (const [statusCode, responseSchema] of Object.entries(response)) {
    if (typeof responseSchema === 'object') {
      const openApiSchema = zodToOpenApiSchema(responseSchema as z.ZodSchema);
      transformedResponse[statusCode] = {
        ...openApiSchema,
      };
    } else {
      transformedResponse[statusCode] = responseSchema;
    }
  }

  return transformedResponse;
};
