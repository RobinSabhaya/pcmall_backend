import * as wishlistController from '@/controllers/wishlist/wishlist.controller';
import * as wishlistValidation from '@/validations/wishlist.validation';
import { FastifyInstance } from 'fastify';
import { USER_ROLE } from '../../../helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default async function wishlistRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: wishlistValidation.createUpdateWishlist,
    handler: wishlistController.addRemoveWishlist,
  });
}
