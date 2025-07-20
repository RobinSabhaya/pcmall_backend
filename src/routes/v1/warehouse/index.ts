import warehouseRoute from './warehouse.route';
import { FastifyInstance } from "fastify";

export default async function indexRoute(fastify: FastifyInstance) {
    fastify.register(warehouseRoute, { prefix: '/warehouse' });
}