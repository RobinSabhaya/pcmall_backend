const express = require('express');
const cartController = require('../../../controllers/cart/cart.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');

const route = express.Router();

/**
 * Add to cart
 */
route.post('/add', authorizeV3([USER_ROLE.BUYER]), cartController.addToCart);
/**
 * Remove to cart
 */
route.delete('/remove/:cartId', authorizeV3([USER_ROLE.BUYER]), cartController.removeToCart);
/**
 * Update cart
 */
route.put('/update', authorizeV3([USER_ROLE.BUYER]), cartController.updateToCart);
/**
 * get all cart
 */
route.get('/all', authorizeV3([USER_ROLE.BUYER]), cartController.getAllCart);

module.exports = route;
