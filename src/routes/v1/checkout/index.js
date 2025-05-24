const express = require('express');
const checkoutRoutes = require('./checkout.route');

const router = express.Router();

router.use('/checkout', checkoutRoutes);

module.exports = router;
