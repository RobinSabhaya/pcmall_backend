import { FastifyInstance } from "fastify";
import * as orderController from '@/controllers/orders/order.controller';
import * as orderValidation from '@/validations/order.validation';
import { USER_ROLE }  from '../../../helpers/constant.helper'
import { createBaseRoute } from "@/utils/baseRoute";

export default async function orderRoute(fastify: FastifyInstance) {

     const route = createBaseRoute(fastify);
    
      route({
        method: "GET",
        url: "/all",
        preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
        schema: orderValidation.getOrderList,
        handler: orderController.getOrderList,
      });
}