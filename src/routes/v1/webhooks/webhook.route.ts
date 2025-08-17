import { FastifyInstance } from 'fastify';

import { config } from '../../../config/config';
import { handleStripeWebhook } from '../../../webhooks/stripeWebhook';

const {
  paymentGateway: { paymentProvider },
} = config;

export default function webhookRoute(fastify: FastifyInstance): void {
  // For Raw Body
  fastify.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (req, body, done) => {
      req.rawBody = body as Buffer;
      done(null, body);
    }
  ); // Must application/json otherwise not work

  fastify.post(`/${paymentProvider}/webhook`, handleStripeWebhook);

  fastify.get('/success', (req, reply) => {
    return reply.send({
      success: true,
      message: 'Payment Success ✅',
    });
  });

  fastify.get('/cancel', (req, reply) => {
    return reply.send({
      success: false,
      message: 'Payment Failed ❌',
    });
  });
}
