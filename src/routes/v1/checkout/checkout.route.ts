import { FastifyInstance } from 'fastify';

import * as checkoutController from '@/controllers/checkout/checkout.controller';
import { createBaseRoute } from '@/utils/baseRoute';
import * as checkoutValidation from '@/validations/checkout.validation';

import { USERROLE } from '../../../helpers/constant.helper';

export default function checkoutRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);
  route({
    method: 'POST',
    url: '/',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: checkoutValidation.checkout,
    description: 'Checkout the products',
    tags: ['Checkout'],
    handler: checkoutController.checkout,
  });
}
