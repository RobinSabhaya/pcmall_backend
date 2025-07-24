import { FastifyInstance } from 'fastify';
import * as checkoutController from '@/controllers/checkout/checkout.controller';
import * as checkoutValidation from '@/validations/checkout.validation';
import { USER_ROLE } from '../../../helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default function checkoutRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);
  route({
    method: 'POST',
    url: '/',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: checkoutValidation.checkout,
    handler: checkoutController.checkout,
  });
}
