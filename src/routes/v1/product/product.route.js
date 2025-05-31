const express = require('express');

const route = express.Router();

const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');
const productController = require('../../../controllers/product/product.controller');

route.get('/all', authorizeV3(USER_ROLE.BUYER), productController.getAllProducts);

route.post(
  '/create-update',
  authorizeV3(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.SELLER),
  productController.createUpdateProduct
);

route.post(
  '/generate-sku',
  authorizeV3(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.SELLER),
  productController.generateProductSku
);

route.delete(
  '/delete',
  authorizeV3(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.SELLER),
  productController.deleteProduct
);

module.exports = route;
