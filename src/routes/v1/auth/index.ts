import { FastifyInstance } from 'fastify';

import authRoute from './auth.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(authRoute, { prefix: '/auth' });
}
