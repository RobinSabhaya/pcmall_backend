import * as ratingController from '@/controllers/rating/rating.controller';
import * as ratingValidation from '@/validations/rating.validation';
import { FastifyInstance } from 'fastify';
import { USER_ROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default function ratingRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    handler: ratingController.createUpdateRating,
  });

  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: ratingValidation.getRatingList,
    handler: ratingController.getRatingList,
  });

  route({
    method: 'GET',
    url: '/count',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: ratingValidation.getRatingCount,
    handler: ratingController.getRatingCount,
  });
}
