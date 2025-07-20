import { FastifyInstance } from "fastify";
import orderRoute from "./order.route";

export default async function indexRoute(fastify: FastifyInstance) {
    fastify.register(orderRoute, { prefix: '/order' });
}