import paymentWebhookRoutes from './webhook.route';
import { FastifyInstance } from "fastify";

export default async function indexRoute(fastify: FastifyInstance) {
    fastify.register(paymentWebhookRoutes, { prefix: '/' });
}
