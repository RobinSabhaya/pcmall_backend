const express = require('express');
const router = express.Router();
const shipmentController = require('../../../controllers/shipment/shipment.controller');
const { authorizeV3 } = require('../../../middlewares/auth');
const { USER_ROLE } = require('../../../helpers/constant.helper');

/** Create shipping */
router.post('/create', authorizeV3(USER_ROLE.BUYER), shipmentController.createShipping);

/** Buy label */
router.post('/buy-label', authorizeV3(USER_ROLE.BUYER), shipmentController.generateBuyLabel);

/** Tracking */
router.get('/track', authorizeV3(USER_ROLE.BUYER), shipmentController.track);

module.exports = router;
