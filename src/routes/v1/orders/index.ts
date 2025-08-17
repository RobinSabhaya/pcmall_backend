import { FastifyInstance } from 'fastify';

import orderRoute from './order.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(orderRoute, { prefix: '/order' });
}
