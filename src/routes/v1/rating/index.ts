import { FastifyInstance } from 'fastify';
import ratingRoute from './rating.route';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(ratingRoute, { prefix: '/rating' });
}
