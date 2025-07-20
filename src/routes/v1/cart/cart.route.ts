import { FastifyInstance } from "fastify";
import * as cartController from '@/controllers/cart/cart.controller';

export default function cartRoute(fastify: FastifyInstance) {
    /**
    * Add to cart
    */
    fastify.post('/add', cartController.addToCart);
    /**
     * Remove to cart
     */
    fastify.delete('/remove/:cartId', cartController.removeToCart);
    /**
     * Update cart
     */
    fastify.put('/update', cartController.updateToCart);
    /**
     * get all cart
     */
    fastify.get('/all', cartController.getAllCart);
}