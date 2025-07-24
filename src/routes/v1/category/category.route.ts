import { FastifyInstance } from 'fastify';
import * as categoryController from '@/controllers/category/category.controller';
import * as categoryValidation from '@/validations/category.validation';
import { USER_ROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default async function categoryRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);
  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: categoryValidation.allCategory,
    handler: categoryController.getAllCategories,
  });
}
