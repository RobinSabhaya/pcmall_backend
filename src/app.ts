import Fastify, { FastifyInstance } from 'fastify';

import '@/models';
import { config } from './config/config';
import routes from './routes/v1';
import webhookRoutes from './routes/v1/webhooks';

export default function buildApp(): FastifyInstance {
  const fastify: FastifyInstance = Fastify({
    logger: false,
  });

  if (config.env != 'test') {
    fastify.register(import('@fastify/cors'));
    fastify.register(import('./plugins/mongoose'));
    fastify.register(import('./plugins/swagger')); // Add Swagger plugin
  }

  fastify.register(import('./plugins/rateLimit'));
  fastify.register(import('./plugins/helmet'));
  fastify.register(import('./plugins/jwt'));
  fastify.register(webhookRoutes); // This package is @fastify/multipart override the webhooks raw body
  fastify.register(routes, { prefix: '/v1' });

  return fastify;
}
