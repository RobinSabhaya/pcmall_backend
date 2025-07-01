const express = require('express');
const orderRoutes = require('./rating.route');

const router = express.Router();

router.use('/rating', orderRoutes);

module.exports = router;
