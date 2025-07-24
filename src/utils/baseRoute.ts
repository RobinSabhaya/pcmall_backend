import { FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export type RouteSchemas = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

export type RequestType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type ExtractRequest<T extends RouteSchemas> = {
  Body: T['body'] extends z.ZodTypeAny ? z.infer<T['body']> : unknown;
  Querystring: T['query'] extends z.ZodTypeAny ? z.infer<T['query']> : unknown;
  Params: T['params'] extends z.ZodTypeAny ? z.infer<T['params']> : unknown;
};

interface RouteConfig<T extends RouteSchemas> {
  method: RequestType;
  url: string;
  schema?: T;
  preHandlerHookHandler?: preHandlerHookHandler | preHandlerHookHandler[];
  handler: (
    request: FastifyRequest<ExtractRequest<T>>,
    reply: FastifyReply,
  ) => Promise<unknown> | unknown;
}

export function createBaseRoute(app: FastifyInstance) {
  const fastify = app.withTypeProvider<ZodTypeProvider>();

  return function baseRoute<T extends RouteSchemas>(config: RouteConfig<T>) {
    fastify.route({
      method: config.method,
      url: config.url,
      ...(config?.schema && {
        schema: {
          ...(config?.schema?.body && { body: config.schema.body }),
          ...(config?.schema?.query && { querystring: config.schema.query }),
          ...(config?.schema?.query && { params: config.schema.params }),
        },
      }),
      ...(config?.preHandlerHookHandler && { preHandler: config?.preHandlerHookHandler }),
      handler: config.handler,
    });
  };
}
