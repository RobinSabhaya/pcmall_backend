import { FastifyInstance } from 'fastify';

import * as productController from '@/controllers/product/product.controller';
import { createBaseRoute } from '@/utils/baseRoute';
import * as productValidation from '@/validations/product.validation';

import { USERROLE } from '../../../helpers/constant.helper';

export default function productRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: productValidation.getAllProducts,
    description: 'Get all products',
    tags: ['Product'],
    handler: productController.getAllProducts,
  });
  route({
    method: 'DELETE',
    url: '/delete',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: productValidation.deleteProduct,
    description: 'Delete products',
    tags: ['Product'],
    handler: productController.deleteProduct,
  });
  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: productValidation.createUpdateProduct,
    description: 'Create & Update product',
    tags: ['Product'],
    handler: productController.createUpdateProduct,
  });
  route({
    method: 'POST',
    url: '/generate-sku',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: productValidation.generateProductSku,
    description: 'Generate product SKU',
    tags: ['Product'],
    handler: productController.generateProductSku,
  });
}
