import { handleStripeWebhook } from '../../../webhooks/stripeWebhook';
import {config} from '../../../config/config'

import { FastifyInstance } from "fastify";
import { USER_ROLE } from '../../../helpers/constant.helper'

export default async function webhookRoute(fastify: FastifyInstance) {

  // TODO: Stripe webhook
  // fastify.post(`/${paymentProvider}/webhook`, express.raw({ type: 'application/json' }), handleStripeWebhook);

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
