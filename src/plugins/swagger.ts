import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { z } from 'zod';
import { JSONSchema } from 'zod/v4/core';

import { getExampleFromSchema, zodToOpenApiSchema } from '@/utils/zod.utils';

import { config } from '../config/config';

// Helper function to transform schema property
const transformSchemaProperty = (
  schemaProperty: z.ZodSchema
): JSONSchema.BaseSchema => {
  if (schemaProperty == null || typeof schemaProperty !== 'object') {
    return schemaProperty;
  }

  const openApiSchema = zodToOpenApiSchema(schemaProperty as z.ZodSchema);
  return {
    ...openApiSchema,
    example: getExampleFromSchema(openApiSchema),
  };
};

// Helper function to transform response schemas
// const transformResponseSchemas = (
//   response: Record<string, any>
// ): Record<string, any> => {
//   const transformedResponse: Record<string, any> = {};

//   for (const [statusCode, responseSchema] of Object.entries(response)) {
//     if (typeof responseSchema === 'object') {
//       const openApiSchema = zodToOpenApiSchema(responseSchema as z.ZodSchema);
//       transformedResponse[statusCode] = {
//         ...openApiSchema,
//         example: getExampleFromSchema(openApiSchema),
//       };
//     } else {
//       transformedResponse[statusCode] = responseSchema;
//     }
//   }

//   return transformedResponse;
// };

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'PCMall API Documentation',
        description: 'API documentation for PCMall backend services',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://${config.host || 'localhost'}:${config.port || 3000}`,
          description: 'Development Server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: ({ schema, url }) => {
      // Transform body schema
      if (schema?.body != null) {
        schema.body = transformSchemaProperty(schema.body as z.ZodSchema);
      }

      // Transform params schema
      if (schema?.params != null) {
        schema.params = transformSchemaProperty(schema.params as z.ZodSchema);
      }

      // Transform querystring schema
      if (schema?.querystring != null) {
        schema.querystring = transformSchemaProperty(
          schema.querystring as z.ZodSchema
        );
      }

      // Transform response schemas (commented out in original)
      // if (schema?.response != null) {
      //   schema.response = transformResponseSchemas(schema.response);
      // }

      return { schema, url };
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
});
