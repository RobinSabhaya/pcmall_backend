import { FastifyInstance } from 'fastify';
import productRoute from './product.route';
import productBrandRoute from './productBrand.route';

export default async function indexRoute(fastify: FastifyInstance) {
  fastify.register(productRoute, { prefix: '/product' });
  fastify.register(productBrandRoute, { prefix: '/product-brand' });
}
