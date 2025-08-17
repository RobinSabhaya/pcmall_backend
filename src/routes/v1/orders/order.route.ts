import { FastifyInstance } from 'fastify';

import * as orderController from '@/controllers/orders/order.controller';
import { createBaseRoute } from '@/utils/baseRoute';
import * as orderValidation from '@/validations/order.validation';

import { USERROLE } from '../../../helpers/constant.helper';

export default function orderRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: orderValidation.getOrderList,
    description: 'Get all orders',
    tags: ['Order'],
    handler: orderController.getOrderList,
  });
}
