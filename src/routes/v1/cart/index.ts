import { FastifyInstance } from 'fastify';
import cartRoute from './cart.route';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(cartRoute, { prefix: '/cart' });
}
