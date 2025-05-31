const express = require('express');
const inventoryRoutes = require('./inventory.route');

const router = express.Router();

router.use('/inventory', inventoryRoutes);

module.exports = router;
