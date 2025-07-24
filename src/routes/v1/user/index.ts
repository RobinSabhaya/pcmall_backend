import userRoute from './user.route';
import sellerRoute from './seller.route';
import { FastifyInstance } from 'fastify';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(userRoute, { prefix: '/user' });
  fastify.register(sellerRoute, { prefix: '/seller' });
}
