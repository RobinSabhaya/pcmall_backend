import { FastifyInstance } from 'fastify';

import ratingRoute from './rating.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(ratingRoute, { prefix: '/rating' });
}
