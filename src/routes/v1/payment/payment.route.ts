import { FastifyInstance } from 'fastify';

import * as paymentController from '@/controllers/payment/payment.controller';
import { USERROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';
import * as paymentValidation from '@/validations/payment.validation';

export default function checkoutRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);
  route({
    method: 'POST',
    url: '/create-refund',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: paymentValidation.createPaymentRefund,
    description: 'Create Refund',
    tags: ['Payment'],
    handler: paymentController.createPaymentRefund,
  });
}
