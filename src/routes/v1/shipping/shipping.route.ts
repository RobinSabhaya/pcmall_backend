import { FastifyInstance } from 'fastify';

import * as shipmentController from '@/controllers/shipment/shipment.controller';
import { USERROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';
import * as shipmentValidation from '@/validations/shipping.validation';

export default function shippingRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: shipmentValidation.createAndUpdateShipping,
    description: 'Create product shipping',
    tags: ['Product Shipping'],
    handler: shipmentController.createShipping,
  });

  route({
    method: 'POST',
    url: '/buy-label',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: shipmentValidation.generateBuyLabel,
    description: 'Buy label product shipping',
    tags: ['Product Shipping'],
    handler: shipmentController.generateBuyLabel,
  });

  route({
    method: 'POST',
    url: '/track',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: shipmentValidation.track,
    description: 'Track product shipping',
    tags: ['Product Shipping'],
    handler: shipmentController.track,
  });
}
