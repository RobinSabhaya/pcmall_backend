import { FastifyInstance } from 'fastify';
import shippingRoute from './shipping.route';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(shippingRoute, { prefix: '/shipping' });
}
