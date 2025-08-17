import { FastifyInstance } from 'fastify';

import categoryRoute from './category.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(categoryRoute, { prefix: '/category' });
}
