import { FastifyInstance } from 'fastify';

import * as userController from '@/controllers/user/user.controller';
import { createBaseRoute } from '@/utils/baseRoute';
import * as userValidation from '@/validations/user.validation';

import { USERROLE } from '../../../helpers/constant.helper';

export default function userRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'PUT',
    url: '/update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: userValidation.updateUser,
    description: 'Update user',
    tags: ['User'],
    handler: userController.updateUser,
  });

  route({
    method: 'GET',
    url: '/details',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: userValidation.getUser,
    description: 'Get user details',
    tags: ['User'],
    handler: userController.getUser,
  });

  route({
    method: 'PUT',
    url: '/address/update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: userValidation.updateAddress,
    description: 'Update address',
    tags: ['User Address'],
    handler: userController.updateAddress,
  });

  route({
    method: 'DELETE',
    url: '/address/delete',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: userValidation.deleteAddress,
    description: 'Delete address',
    tags: ['User Address'],
    handler: userController.deleteAddress,
  });
}
