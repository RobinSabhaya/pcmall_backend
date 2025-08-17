import { FastifyInstance } from 'fastify';

import paymentRoute from './payment.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(paymentRoute, { prefix: '/payment' });
}
