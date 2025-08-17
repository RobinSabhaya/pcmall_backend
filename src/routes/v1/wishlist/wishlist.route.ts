import { FastifyInstance } from 'fastify';

import * as wishlistController from '@/controllers/wishlist/wishlist.controller';
import { createBaseRoute } from '@/utils/baseRoute';
import * as wishlistValidation from '@/validations/wishlist.validation';

import { USERROLE } from '../../../helpers/constant.helper';

export default function wishlistRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: wishlistValidation.createUpdateWishlist,
    description: 'Create & Update wishlist',
    tags: ['Wishlist'],
    handler: wishlistController.addRemoveWishlist,
  });
}
