import wishlistRoute from './wishlist.route';
import { FastifyInstance } from "fastify";

export default async function indexRoute(fastify: FastifyInstance) {
    fastify.register(wishlistRoute, { prefix: '/wishlist' });
}

