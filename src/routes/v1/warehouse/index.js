const express = require('express');
const warehouseRoutes = require('./warehouse.route');

const router = express.Router();

router.use('/warehouse', warehouseRoutes);

module.exports = router;
