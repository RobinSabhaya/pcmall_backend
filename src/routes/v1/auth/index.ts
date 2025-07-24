import { FastifyInstance } from 'fastify';
import authRoute from './auth.route';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(authRoute, { prefix: '/auth' });
}
