import * as wishlistController from '../../../controllers/wishlist/wishlist.controller'
import { FastifyInstance } from "fastify";
import { USER_ROLE } from '../../../helpers/constant.helper'

export default async function wishlistRoute(fastify: FastifyInstance) {
    fastify.post('/', wishlistController.addRemoveWishlist);
}
