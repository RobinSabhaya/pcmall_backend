import { FastifyInstance } from 'fastify';

import paymentWebhookRoutes from './webhook.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(paymentWebhookRoutes, { prefix: '/' });
}
