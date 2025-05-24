const express = require('express');

const route = express.Router();
const wishlistController = require('../../../controllers/wishlist/wishlist.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');

route.post('/', authorizeV3(USER_ROLE.BUYER), wishlistController.addRemoveWishlist);

module.exports = route;
