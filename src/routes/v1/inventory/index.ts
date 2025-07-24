import inventoryRoutes from './inventory.route';
import { FastifyInstance } from 'fastify';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(inventoryRoutes, { prefix: '/inventory' });
}
