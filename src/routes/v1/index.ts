import { FastifyInstance } from 'fastify';

import authRoute from './auth';
import cartRoute from './cart';
import categoryRoute from './category';
import checkoutRoute from './checkout';
import fileRoute from './file';
import inventoryRoute from './inventory';
import orderRoute from './orders';
import paymentRoute from './payment';
import productRoute from './product';
import ratingRoute from './rating';
import shippingRoute from './shipping';
import userRoute from './user';
import warehouseRoute from './warehouse';
import wishlistRoute from './wishlist';

const routes = [
  { route: authRoute },
  { route: cartRoute },
  { route: categoryRoute },
  { route: checkoutRoute },
  { route: orderRoute },
  { route: userRoute },
  { route: wishlistRoute },
  { route: productRoute },
  { route: shippingRoute },
  { route: inventoryRoute },
  { route: warehouseRoute },
  { route: ratingRoute },
  { route: paymentRoute },
  { route: fileRoute },
] as const;

export default async function indexRoutes(
  fastify: FastifyInstance
): Promise<void> {
  await Promise.all(routes.map(({ route }) => fastify.register(route)));
}
