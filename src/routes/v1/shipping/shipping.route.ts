import * as shipmentController from '@/controllers/shipment/shipment.controller';
import * as shipmentValidation from '@/validations/shipping.validation';
import { FastifyInstance } from 'fastify';
import { USER_ROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default function shippingRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: shipmentValidation.createAndUpdateShipping,
    handler: shipmentController.createShipping,
  });

  route({
    method: 'POST',
    url: '/buy-label',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: shipmentValidation.generateBuyLabel,
    handler: shipmentController.generateBuyLabel,
  });

  route({
    method: 'POST',
    url: '/track',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: shipmentValidation.track,
    handler: shipmentController.track,
  });
}
