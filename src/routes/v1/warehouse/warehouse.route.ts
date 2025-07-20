import * as warehouseController from '@/controllers/warehouse/warehouse.controller';
import { FastifyInstance } from "fastify";
import { USER_ROLE } from '../../../helpers/constant.helper'

export default async function warehoseRoute(fastify: FastifyInstance) {
  fastify.post(
    '/create-update',
    warehouseController.createUpdateWarehouse
  );
  
  fastify.delete(
    '/delete',
    warehouseController.deleteWarehouse
  );
  
  fastify.get(
    '/all',
    warehouseController.getAllWarehouse
  );
}
