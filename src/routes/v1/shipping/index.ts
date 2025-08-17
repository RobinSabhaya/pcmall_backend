import { FastifyInstance } from 'fastify';

import shippingRoute from './shipping.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(shippingRoute, { prefix: '/shipping' });
}
