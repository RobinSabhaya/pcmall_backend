import { FastifyInstance } from 'fastify';

import cartRoute from './cart.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(cartRoute, { prefix: '/cart' });
}
