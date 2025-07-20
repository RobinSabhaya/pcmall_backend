import { FastifyInstance } from "fastify";
import * as checkoutController from '../../../controllers/checkout/checkout.controller';
import { USER_ROLE }  from '../../../helpers/constant.helper'

export default function checkoutRoute(fastify: FastifyInstance) {
    fastify.post('/', checkoutController.checkout);
}