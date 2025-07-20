import checkoutRoute from "./checkout.route";
import { FastifyInstance } from "fastify";

export default function indexRoute(fastify: FastifyInstance) {
    fastify.register(checkoutRoute, { prefix: '/checkout' });
}