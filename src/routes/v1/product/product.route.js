const express = require('express');

const route = express.Router();

const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');
const productController = require('../../../controllers/product/product.controller');

route.get('/all', authorizeV3(USER_ROLE.BUYER), productController.getAllProducts);

module.exports = route;
