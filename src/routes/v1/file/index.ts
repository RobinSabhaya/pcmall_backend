import { FastifyInstance } from 'fastify';

import fileRoute from './file.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(fileRoute, { prefix: '/file' });
}
