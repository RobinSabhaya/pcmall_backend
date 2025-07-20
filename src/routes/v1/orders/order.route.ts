import { FastifyInstance } from "fastify";
import * as orderController from '../../../controllers/orders/order.controller';
import { USER_ROLE }  from '../../../helpers/constant.helper'

export default async function orderRoute(fastify: FastifyInstance) {
    fastify.post('/all', orderController.getOrderList);
}