import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { config } from '../config/config';
import { z } from 'zod'
import { JSONSchema } from 'zod/v4/core';

function getExampleFromSchema(schema: JSONSchema.BaseSchema): Record<string,string> {
  const example: Record<string,string> = {};
  for (const [key, value] of Object.entries(schema.properties as Record<string, JSONSchema.BaseSchema>)) {
    example[key] = value.type || 'unknown';
    }
    return example;
}

function getExampleValue(schema: any): any {
  switch (schema._def?.typeName) {
    case 'ZodString':
      return 'string';
    case 'ZodNumber':
      return 123;
    case 'ZodBoolean':
      return true;
    case 'ZodArray':
      return [getExampleValue(schema._def.type)];
    default:
      return 'example';
  }
}

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
      if (schema?.body && typeof schema?.body === 'object') {
        (schema.body as Record<string, object>).example = getExampleFromSchema(z.toJSONSchema(schema?.body as z.ZodSchema));        
      }

      if (schema?.params && typeof schema?.params === 'object') {
        (schema.params as Record<string, object>).example = getExampleFromSchema(z.toJSONSchema(schema?.params as z.ZodSchema));        
      }

      if (schema?.querystring && typeof schema?.querystring === 'object') {
        (schema.querystring as Record<string, object>).example = getExampleFromSchema(z.toJSONSchema(schema?.querystring as z.ZodSchema));        
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
  });
});