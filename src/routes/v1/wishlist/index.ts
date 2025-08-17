import { FastifyInstance } from 'fastify';

import wishlistRoute from './wishlist.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(wishlistRoute, { prefix: '/wishlist' });
}
