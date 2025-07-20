import { FastifyInstance } from "fastify";
import * as inventoryController from '../../../controllers/inventory/inventory.controller';
import { USER_ROLE }  from '../../../helpers/constant.helper'

export default async function cartRoute(fastify: FastifyInstance) {
  fastify.post(
    '/create-update',
    inventoryController.createUpdateInventory
  );
  
  fastify.delete(
    '/delete',
    inventoryController.deleteInventory
  );
  
  fastify.get(
    '/all',
    inventoryController.getAllInventory
  );
}