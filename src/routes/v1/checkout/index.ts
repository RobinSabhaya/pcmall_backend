import { FastifyInstance } from 'fastify';

import checkoutRoute from './checkout.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(checkoutRoute, { prefix: '/checkout' });
}
