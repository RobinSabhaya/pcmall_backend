import { FastifyInstance } from 'fastify';

import inventoryRoutes from './inventory.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(inventoryRoutes, { prefix: '/inventory' });
}
