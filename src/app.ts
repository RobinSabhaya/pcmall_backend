import Fastify, { FastifyInstance } from 'fastify';

import '@/models';
import { config } from './config/config';
import routes from './routes/v1';
import { cronJobs } from './services/cron/cron.service';

export default function buildApp(): FastifyInstance {
  const fastify: FastifyInstance = Fastify({
    logger: false,
  });

  if (config.env != 'test') {
    fastify.register(import('@fastify/cors'), {
      origin: ['http://localhost:3000', 'https://pcmall-web.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    });
    fastify.register(import('./plugins/mongoose'));
    fastify.register(import('./plugins/swagger')); // Add Swagger plugin
  }

  if (config.env == 'production') {
    fastify.register(import('./plugins/rateLimit'));
    fastify.register(import('./plugins/helmet'));
    cronJobs(); // Crons
  }

  fastify.register(import('./plugins/jwt'));
  fastify.register(import('./plugins/cookie'));
  // fastify.register(webhookRoutes); // This package is @fastify/multipart override the webhooks raw body
  fastify.register(routes, { prefix: '/v1' });

  return fastify;
}
