const express = require('express');
const orderController = require('../../../controllers/orders/order.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');

const router = express.Router();

router.get('/all', authorizeV3(USER_ROLE.BUYER), orderController.getOrderList);

module.exports = router;
