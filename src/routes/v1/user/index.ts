import { FastifyInstance } from 'fastify';

import sellerRoute from './seller.route';
import userRoute from './user.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(userRoute, { prefix: '/user' });
  fastify.register(sellerRoute, { prefix: '/seller' });
}
