import * as warehouseController from '@/controllers/warehouse/warehouse.controller';
import * as warehouseValidation from '@/validations/warehouse.validation';
import { FastifyInstance } from 'fastify';
import { USER_ROLE } from '../../../helpers/constant.helper';
import { createBaseRoute } from '@/utils/baseRoute';

export default function warehouseRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: warehouseValidation.createUpdateWarehouse,
    handler: warehouseController.createUpdateWarehouse,
  });
  route({
    method: 'DELETE',
    url: '/delete',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: warehouseValidation.deleteWarehouse,
    handler: warehouseController.deleteWarehouse,
  });
  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: warehouseValidation.getAllWarehouse,
    handler: warehouseController.getAllWarehouse,
  });
}
