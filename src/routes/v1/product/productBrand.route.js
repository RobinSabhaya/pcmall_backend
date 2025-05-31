const express = require('express');

const route = express.Router();

const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');
const productBrandController = require('../../../controllers/product/productBrand.controller');

route.post(
  '/create-update',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  productBrandController.createUpdateBrand
);

route.delete(
  '/delete',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  productBrandController.deleteBrand
);

route.get(
  '/all',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  productBrandController.getAllBrands
);

module.exports = route;
