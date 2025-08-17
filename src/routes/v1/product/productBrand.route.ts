import { FastifyInstance } from 'fastify';

import * as productBrandController from '@/controllers/product/productBrand.controller';
import { USERROLE } from '@/helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';
import * as productBrandValidation from '@/validations/brand.validation';

export default function productBrandRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: productBrandValidation.createUpdateBrand,
    description: 'Create & Update product brand',
    tags: ['Product Brand'],
    handler: productBrandController.createUpdateBrand,
  });

  route({
    method: 'DELETE',
    url: '/delete',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: productBrandValidation.deleteBrand,
    description: 'Delete product brand',
    tags: ['Product Brand'],
    handler: productBrandController.deleteBrand,
  });

  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: productBrandValidation.getAllBrands,
    description: 'Get product brands',
    tags: ['Product Brand'],
    handler: productBrandController.getAllBrands,
  });
}
