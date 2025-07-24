import * as sellerController from '@/controllers/user/seller.controller';
import * as sellerValidation from '@/validations/seller.validation';
import { FastifyInstance } from 'fastify';
import { USER_ROLE } from '../../../helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default async function cartRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: sellerValidation.createUpdateSeller,
    handler: sellerController.createUpdateSeller,
  });
  route({
    method: 'DELETE',
    url: '/delete',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: sellerValidation.deleteSeller,
    handler: sellerController.deleteSeller,
  });
  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: sellerValidation.getAllSellers,
    handler: sellerController.getAllSellers,
  });
}
