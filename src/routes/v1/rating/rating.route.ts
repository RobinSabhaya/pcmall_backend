import { FastifyInstance } from 'fastify';

import * as ratingController from '@/controllers/rating/rating.controller';
import { USERROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';
import * as ratingValidation from '@/validations/rating.validation';

export default function ratingRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);
  route({
    method: 'POST',
    url: '/create-update',
    schema: ratingValidation.createUpdateRating,
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    description: 'Create & Update product rating',
    tags: ['Product Rating'],
    handler: ratingController.createUpdateRating,
  });

  route({
    method: 'DELETE',
    url: '/delete',
    schema: ratingValidation.deleteRating,
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    description: 'Delete product rating',
    tags: ['Product Rating'],
    handler: ratingController.deleteRating,
  });

  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1('optional')],
    schema: ratingValidation.getRatingList,
    description: 'Get all product rating',
    tags: ['Product Rating'],
    handler: ratingController.getRatingList,
  });

  route({
    method: 'GET',
    url: '/count',
    preHandlerHookHandler: [fastify.authorizeV1('optional')],
    schema: ratingValidation.getRatingCount,
    description: 'Get product rating count',
    tags: ['Product Rating'],
    handler: ratingController.getRatingCount,
  });
}
