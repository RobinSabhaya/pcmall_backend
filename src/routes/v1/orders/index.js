const express = require('express');
const orderRoutes = require('./order.route');

const router = express.Router();

router.use('/order', orderRoutes);

module.exports = router;
