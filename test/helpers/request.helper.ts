import { OutgoingHttpHeaders } from 'http';

import { FastifyInstance, HTTPMethods, InjectOptions } from 'fastify';

export type RequestType = HTTPMethods;

export interface ITestResponse<T = unknown> {
  statusCode: number;
  body: T;
  headers: OutgoingHttpHeaders;
}

export interface IRequestOptions {
  headers?: Record<string, string>;
  body?: string | object | Buffer | undefined;
  query?: Record<string, string | number | boolean>;
}

export async function makeRequest<T = unknown>(
  app: FastifyInstance,
  method: RequestType,
  url: string,
  options: IRequestOptions = {}
): Promise<ITestResponse<T>> {
  const { headers = {}, body, query } = options;

  const response = await app.inject({
    method,
    url,
    headers,
    payload: body,
    query,
  } as InjectOptions);

  let parsedBody: T;
  try {
    parsedBody = response.body ? JSON.parse(response.body) : null;
  } catch (error: unknown) {
    console.log('🚀 ~ makeRequest ~ error:', error);
    // If JSON parsing fails, return the raw body
    parsedBody = response.body as T;
  }

  return {
    statusCode: response.statusCode,
    body: parsedBody,
    headers: response.headers,
  };
}
