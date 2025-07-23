import { FastifyInstance } from "fastify";
import * as inventoryController from '@/controllers/inventory/inventory.controller';
import * as inventoryValidation from '@/validations/inventory.validation';
import { USER_ROLE }  from '../../../helpers/constant.helper'
import { createBaseRoute } from "@/utils/baseRoute";

export default async function inventoryRoute(fastify: FastifyInstance) {

   const route = createBaseRoute(fastify);
  
    route({
      method: "POST",
      url: "/create-update",
      preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
      schema: inventoryValidation.createUpdateInventory,
      handler: inventoryController.createUpdateInventory,
    });
    route({
      method: "DELETE",
      url: "/delete",
      preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
      schema: inventoryValidation.deleteInventory,
      handler: inventoryController.deleteInventory,
    });
    route({
      method: "GET",
      url: "/all",
      preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
      schema: inventoryValidation.getAllInventory,
      handler: inventoryController.getAllInventory,
    });
}