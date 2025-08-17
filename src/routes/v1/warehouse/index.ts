import { FastifyInstance } from 'fastify';

import warehouseRoute from './warehouse.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(warehouseRoute, { prefix: '/warehouse' });
}
