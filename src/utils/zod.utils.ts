import { z } from 'zod'
import { JSONSchema } from 'zod/v4/core';

export function getExampleFromSchema(schema: JSONSchema.BaseSchema): Record<string, string> {
  const example: Record<string,string> = {};
  for (const [key, value] of Object.entries(schema.properties as Record<string, JSONSchema.BaseSchema>)) {
    example[key] = value.type || 'unknown';
    }
    return example;
}

// Helper function to convert Zod schema to proper OpenAPI schema
export function zodToOpenApiSchema(zodSchema: z.ZodSchema): any {
  const jsonSchema = z.toJSONSchema(zodSchema);
  
  // Remove Zod-specific properties and convert to OpenAPI format
  function cleanSchema(schema:JSONSchema.BaseSchema): any {
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    // Remove Zod-specific properties
    const cleaned = { ...schema };
    delete cleaned['~standard'];
    delete cleaned['def'];

    // Handle object properties
    if (cleaned.properties) {
      const newProperties: any = {};
      for (const [key, value] of Object.entries(cleaned.properties)) {
        newProperties[key] = cleanSchema(value as JSONSchema.BaseSchema);
      }
      cleaned.properties = newProperties;
    }

    // Handle array items
    if (cleaned.items) {
      cleaned.items = cleanSchema(cleaned.items as JSONSchema.BaseSchema);
    }

    // Handle oneOf, anyOf, allOf
    ['oneOf', 'anyOf', 'allOf'].forEach(key => {
      if (cleaned[key] && Array.isArray(cleaned[key])) {
        cleaned[key] = cleaned[key].map((item: any) => cleanSchema(item));
      }
    });

    return cleaned;
  }

  return cleanSchema(jsonSchema);
}