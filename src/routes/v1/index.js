const express = require('express');
const authRoute = require('./auth');
const cartRoute = require('./cart');
const categoryRoute = require('./category');
const checkoutRoute = require('./checkout');
const orderRoute = require('./orders');
const userRoute = require('./user');
const wishlistRoute = require('./wishlist');
const productRoute = require('./product');
const shippingRoute = require('./shipping');
const inventoryRoute = require('./inventory');
const warehouseRoute = require('./warehouse');
const ratingRoute = require('./rating');
const docsRoute = require('../v1/docs/docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: authRoute,
  },
  {
    path: '/',
    route: cartRoute,
  },
  {
    path: '/',
    route: categoryRoute,
  },
  {
    path: '/',
    route: checkoutRoute,
  },
  {
    path: '/',
    route: orderRoute,
  },
  {
    path: '/',
    route: userRoute,
  },
  {
    path: '/',
    route: wishlistRoute,
  },
  {
    path: '/',
    route: productRoute,
  },
  {
    path: '/',
    route: shippingRoute,
  },
  {
    path: '/',
    route: inventoryRoute,
  },
  {
    path: '/',
    route: warehouseRoute,
  },
  {
    path: '/',
    route: ratingRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
