const express = require('express');
const shippingRoutes = require('./shipping.route');

const router = express.Router();

router.use('/shipping', shippingRoutes);

module.exports = router;
