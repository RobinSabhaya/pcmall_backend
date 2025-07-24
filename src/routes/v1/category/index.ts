import { FastifyInstance } from 'fastify';
import categoryRoute from './category.route';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(categoryRoute, { prefix: '/category' });
}
