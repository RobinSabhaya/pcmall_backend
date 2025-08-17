import { FastifyInstance } from 'fastify';

import * as ratingController from '@/controllers/rating/rating.controller';
import { USERROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';
import * as ratingValidation from '@/validations/rating.validation';

export default function ratingRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);
  fastify.register(import('@/plugins/upload'));
  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    description: 'Create & Update product rating',
    tags: ['Product Rating'],
    handler: ratingController.createUpdateRating,
  });

  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: ratingValidation.getRatingList,
    description: 'Get all product rating',
    tags: ['Product Rating'],
    handler: ratingController.getRatingList,
  });

  route({
    method: 'GET',
    url: '/count',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: ratingValidation.getRatingCount,
    description: 'Get product rating count',
    tags: ['Product Rating'],
    handler: ratingController.getRatingCount,
  });
}
