import { FastifyInstance } from 'fastify';

import * as inventoryController from '@/controllers/inventory/inventory.controller';
import { createBaseRoute } from '@/utils/baseRoute';
import * as inventoryValidation from '@/validations/inventory.validation';

import { USERROLE } from '../../../helpers/constant.helper';

export default function inventoryRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/create-update',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: inventoryValidation.createUpdateInventory,
    description: 'Create & Update Inventory',
    tags: ['Inventory'],
    handler: inventoryController.createUpdateInventory,
  });
  route({
    method: 'DELETE',
    url: '/delete',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: inventoryValidation.deleteInventory,
    description: 'Delete Inventory',
    tags: ['Inventory'],
    handler: inventoryController.deleteInventory,
  });
  route({
    method: 'GET',
    url: '/all',
    preHandlerHookHandler: [fastify.authorizeV1(USERROLE.BUYER)],
    schema: inventoryValidation.getAllInventory,
    description: 'Get All Inventories',
    tags: ['Inventory'],
    handler: inventoryController.getAllInventory,
  });
}
