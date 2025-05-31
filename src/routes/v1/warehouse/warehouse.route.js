const express = require('express');
const warehouseController = require('../../../controllers/warehouse/warehouse.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');

const router = express.Router();

router.post(
  '/create-update',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  warehouseController.createUpdateWarehouse
);

router.delete(
  '/delete',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  warehouseController.deleteWarehouse
);

router.get(
  '/all',
  authorizeV3(USER_ROLE.SELLER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  warehouseController.getAllWarehouse
);

module.exports = router;
