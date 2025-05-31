const express = require('express');
const inventoryController = require('../../../controllers/inventory/inventory.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');

const router = express.Router();

router.post(
  '/create-update',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  inventoryController.createUpdateInventory
);

router.delete(
  '/delete',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  inventoryController.deleteInventory
);

router.get(
  '/all',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  inventoryController.getAllInventory
);

module.exports = router;
