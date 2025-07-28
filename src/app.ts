import { FastifyInstance } from 'fastify';
import routes from './routes/v1';
import webhookRoutes from './routes/v1/webhooks';
import '@/models';

export default async function app(fastify: FastifyInstance) {
  await fastify.register(import('@fastify/cors'));
  await fastify.register(import('./plugins/mongoose'));
  await fastify.register(import('./plugins/jwt'));
  fastify.register(webhookRoutes); // This package is @fastify/multipart override the webhooks raw body 
  fastify.register(routes, { prefix: '/v1' });
}
