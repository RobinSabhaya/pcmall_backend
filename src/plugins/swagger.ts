import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { z } from 'zod';
import { JSONSchema } from 'zod/v4/core';

import {
  transformResponseSchemas,
  zodToOpenApiSchema,
} from '@/utils/zod.utils';

import { config } from '../config/config';

// Helper function to transform schema property
const transformSchemaProperty = (
  schemaProperty: z.ZodSchema
): JSONSchema.BaseSchema => {
  if (schemaProperty == null || typeof schemaProperty !== 'object') {
    return schemaProperty;
  }

  return zodToOpenApiSchema(schemaProperty as z.ZodSchema);
};

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
          url: `http://${config.host}:${config.port}`,
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
      security: [{ bearerAuth: [] }],
    },
    transform: ({ schema, url }) => {
      // Transform body schema
      if (schema?.body != null) {
        schema.body = transformSchemaProperty(schema.body as z.ZodAny);
      }

      // Transform params schema
      if (schema?.params != null) {
        schema.params = transformSchemaProperty(schema.params as z.ZodAny);
      }

      // Transform querystring schema
      if (schema?.querystring != null) {
        schema.querystring = transformSchemaProperty(
          schema.querystring as z.ZodAny
        );
      }

      // Transform response schemas (commented out in original)
      if (schema?.response != null) {
        schema.response = transformResponseSchemas(schema.response as z.ZodAny);
      }

      return { schema, url };
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: `http://127.0.0.1:${config.port} http://localhost:${config.port}`,
  });
});
