import { FastifyInstance } from 'fastify';

import * as sellerController from '@/controllers/user/seller.controller';
import { createBaseRoute } from '@/utils/baseRoute';
import * as sellerValidation from '@/validations/seller.validation';

import { USERROLE } from '../../../helpers/constant.helper';

export default function cartRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: sellerValidation.createUpdateSeller,
    description: 'Create & Update seller',
    tags: ['Seller'],
    handler: sellerController.createUpdateSeller,
  });
  route({
    method: 'DELETE',
    url: '/delete',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: sellerValidation.deleteSeller,
    description: 'Delete seller',
    tags: ['Seller'],
    handler: sellerController.deleteSeller,
  });
  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: sellerValidation.getAllSellers,
    description: 'Get all users',
    tags: ['Seller'],
    handler: sellerController.getAllSellers,
  });
}
