const express = require('express');
const categoryRoutes = require('./category.route');

const router = express.Router();

router.use('/category', categoryRoutes);

module.exports = router;
