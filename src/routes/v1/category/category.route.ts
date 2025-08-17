import { FastifyInstance } from 'fastify';

import * as categoryController from '@/controllers/category/category.controller';
import { USERROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default function categoryRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);
  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    // schema: categoryValidation.allCategory,
    description: 'Get category',
    tags: ['Category'],
    handler: categoryController.getAllCategories,
  });
}
