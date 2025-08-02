import { FastifyInstance } from 'fastify';
import * as paymentController from '@/controllers/payment/payment.controller';
import * as paymentValidation from '@/validations/payment.validation';
import { USER_ROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default function checkoutRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);
  route({
    method: 'POST',
    url: '/create-refund',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: paymentValidation.createPaymentRefund,
    handler: paymentController.createPaymentRefund,
  });
}
