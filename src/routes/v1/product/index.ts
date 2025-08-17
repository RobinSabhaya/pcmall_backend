import { FastifyInstance } from 'fastify';

import productRoute from './product.route';
import productBrandRoute from './productBrand.route';

export default function indexRoute(fastify: FastifyInstance): void {
  fastify.register(productRoute, { prefix: '/product' });
  fastify.register(productBrandRoute, { prefix: '/product-brand' });
}
