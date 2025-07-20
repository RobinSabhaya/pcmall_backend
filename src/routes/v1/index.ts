import { FastifyInstance } from "fastify";
import authRoute from './auth';
import cartRoute from './cart';
import categoryRoute from './category';
import checkoutRoute from './checkout';
import orderRoute from './orders';
import userRoute from './user';
import wishlistRoute from './wishlist';
import productRoute from './product';
import shippingRoute from './shipping';
import inventoryRoute from './inventory';
import warehouseRoute from './warehouse';
import ratingRoute from './rating';

export default function indexRoutes(fastify: FastifyInstance) {
  fastify.register(authRoute);
  fastify.register(cartRoute);
  fastify.register(categoryRoute);
  fastify.register(checkoutRoute);
  fastify.register(orderRoute);
  fastify.register(userRoute);
  fastify.register(wishlistRoute);
  fastify.register(productRoute);
  fastify.register(shippingRoute);
  fastify.register(inventoryRoute);
  fastify.register(warehouseRoute);
  fastify.register(ratingRoute);
}