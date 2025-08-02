import { FastifyInstance } from 'fastify';
import paymentRoute from './payment.route';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(paymentRoute, { prefix: '/payment' });
}
