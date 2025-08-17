import { FastifyInstance } from 'fastify';

import * as warehouseController from '@/controllers/warehouse/warehouse.controller';
import { createBaseRoute } from '@/utils/baseRoute';
import * as warehouseValidation from '@/validations/warehouse.validation';

import { USERROLE } from '../../../helpers/constant.helper';

export default function warehouseRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: warehouseValidation.createUpdateWarehouse,
    description: 'Create & Update warehouse',
    tags: ['Warehouse'],
    handler: warehouseController.createUpdateWarehouse,
  });
  route({
    method: 'DELETE',
    url: '/delete',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: warehouseValidation.deleteWarehouse,
    description: 'Delete warehouse',
    tags: ['Warehouse'],
    handler: warehouseController.deleteWarehouse,
  });
  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: warehouseValidation.getAllWarehouse,
    description: 'Get all warehouses',
    tags: ['Warehouse'],
    handler: warehouseController.getAllWarehouse,
  });
}
