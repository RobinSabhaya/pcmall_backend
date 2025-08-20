import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
  RouteOptions,
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { config as envConfig } from '@/config/config';

export type RouteSchemas = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  response?: {
    [statusCode: number]: z.ZodTypeAny;
  };
};

export type RequestType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ExtractRequest<T extends RouteSchemas> = {
  Body: T['body'] extends z.ZodTypeAny ? z.infer<T['body']> : unknown;
  Querystring: T['query'] extends z.ZodTypeAny ? z.infer<T['query']> : unknown;
  Params: T['params'] extends z.ZodTypeAny ? z.infer<T['params']> : unknown;
};

interface IRouteConfig<T extends RouteSchemas> {
  method: RequestType;
  url: string;
  schema?: T;
  description?: string;
  tags?: string[];
  preHandlerHookHandler?: preHandlerHookHandler | preHandlerHookHandler[];
  handler: (
    request: FastifyRequest<ExtractRequest<T>>,
    reply: FastifyReply
  ) => Promise<unknown> | unknown;
}

type RouteSchema = {
  description: string;
  tags: string[];
  body?: z.ZodTypeAny;
  querystring?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  response?: {
    [statusCode: number]: z.ZodTypeAny;
  };
};

type SchemaMapping = {
  sourceKey: keyof RouteSchemas;
  targetKey: keyof RouteSchema;
}[];

const SCHEMA_MAPPINGS: SchemaMapping = [
  { sourceKey: 'body', targetKey: 'body' },
  { sourceKey: 'query', targetKey: 'querystring' },
  { sourceKey: 'params', targetKey: 'params' },
  { sourceKey: 'response', targetKey: 'response' },
];

function applySchemaMapping<T extends RouteSchemas>(
  schema: RouteSchema,
  config: IRouteConfig<T>
): void {
  SCHEMA_MAPPINGS.forEach(({ sourceKey, targetKey }) => {
    if (config?.schema?.[sourceKey]) {
      (schema as Record<string, unknown>)[targetKey] = config.schema[sourceKey];
    }
  });
}

function buildRouteSchema<T extends RouteSchemas>(
  config: IRouteConfig<T>
): RouteSchema {
  const schema: RouteSchema = {
    description: config.description ?? '',
    tags: config.tags ?? [],
  };

  applySchemaMapping(schema, config);
  return schema;
}

type FastifyRouteOptions<T extends RouteSchemas> = {
  method: RequestType;
  url: string;
  schema?: RouteSchema;
  handler: (
    request: FastifyRequest<ExtractRequest<T>>,
    reply: FastifyReply
  ) => Promise<unknown> | unknown;
  preHandler?: preHandlerHookHandler | preHandlerHookHandler[];
};

function buildRouteOptions<T extends RouteSchemas>(
  config: IRouteConfig<T>
): FastifyRouteOptions<T> {
  const options: FastifyRouteOptions<T> = {
    method: config.method,
    url: config.url,
    ...(envConfig.env !== 'test' && { schema: buildRouteSchema(config) }),
    handler: config.handler,
  };

  if (config?.preHandlerHookHandler) {
    options.preHandler = config.preHandlerHookHandler;
  }

  return options;
}

export function createBaseRoute(
  app: FastifyInstance
): <T extends RouteSchemas>(config: IRouteConfig<T>) => void {
  const fastify = app.withTypeProvider<ZodTypeProvider>();

  return function baseRoute<T extends RouteSchemas>(
    config: IRouteConfig<T>
  ): void {
    const routeOptions = buildRouteOptions(config);
    fastify.route(routeOptions as RouteOptions);
  };
}
