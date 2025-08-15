import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { config } from '../config/config';
import { z } from 'zod'
import { getExampleFromSchema, zodToOpenApiSchema } from '@/utils/zod.utils';

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
        const openApiSchema = zodToOpenApiSchema(schema?.body as z.ZodSchema);
        schema.body = {
          ...openApiSchema,
          example: getExampleFromSchema(openApiSchema)
        };      
      }

      if (schema?.params && typeof schema?.params === 'object') {
          const openApiSchema = zodToOpenApiSchema(schema?.params as z.ZodSchema);
        schema.body = {
          ...openApiSchema,
          example: getExampleFromSchema(openApiSchema)
        };        
      }

      if (schema?.querystring && typeof schema?.querystring === 'object') {
        const openApiSchema = zodToOpenApiSchema(schema?.querystring as z.ZodSchema);
        schema.body = {
          ...openApiSchema,
          example: getExampleFromSchema(openApiSchema)
        };
      }
      
      if (schema?.response) {
        const transformedResponse: any = {};
        for (const [statusCode, responseSchema] of Object.entries(schema.response)) {
          if (typeof responseSchema === 'object') {
            const openApiSchema = zodToOpenApiSchema(responseSchema as z.ZodSchema);
            transformedResponse[statusCode] = {
              ...openApiSchema,
              example: getExampleFromSchema(openApiSchema)
            };
          } else {
            transformedResponse[statusCode] = responseSchema;
          }
        }
        schema.response = transformedResponse;
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