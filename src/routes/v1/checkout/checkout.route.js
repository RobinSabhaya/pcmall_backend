const express = require('express');
const checkoutController = require('../../../controllers/checkout/checkout.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');

const router = express.Router();

router.post('/', authorizeV3(USER_ROLE.BUYER), checkoutController.checkout);

module.exports = router;
