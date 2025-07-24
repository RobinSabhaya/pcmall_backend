import { FastifyInstance } from 'fastify';
import routes from './routes/v1';
import '@/models';

export default async function app(fastify: FastifyInstance) {
  await fastify.register(import('@fastify/cors'));
  await fastify.register(import('./plugins/mongoose'));
  await fastify.register(import('./plugins/jwt'));
  fastify.register(import('./plugins/upload'));
  fastify.register(routes, { prefix: '/v1' });
}
