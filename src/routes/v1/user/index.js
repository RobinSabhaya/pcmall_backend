const express = require('express');
const userRoutes = require('./user.route');
const sellerRoutes = require('./seller.route');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/seller', sellerRoutes);

module.exports = router;
