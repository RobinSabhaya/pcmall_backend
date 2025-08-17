import { FastifyInstance } from 'fastify';

import * as cartController from '@/controllers/cart/cart.controller';
import { USERROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';
import * as cartValidation from '@/validations/cart.validation';

export default function cartRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/add',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: cartValidation.addToCart,
    description: 'Add a product to cart',
    tags: ['Cart'],
    handler: cartController.addToCart,
  });

  route({
    method: 'DELETE',
    url: '/remove/:cartId',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: cartValidation.removeToCart,
    description: 'Remove a product from cart',
    tags: ['Cart'],
    handler: cartController.removeToCart,
  });

  route({
    method: 'PUT',
    url: '/update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: cartValidation.updateToCart,
    description: 'Update cart item quantity',
    tags: ['Cart'],
    handler: cartController.updateToCart,
  });

  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: cartValidation.getAllCart,
    description: 'Get all cart items',
    tags: ['Cart'],
    handler: cartController.getAllCart,
  });
}
