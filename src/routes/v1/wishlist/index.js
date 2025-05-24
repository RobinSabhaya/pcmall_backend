const express = require('express');
const wishlistRoutes = require('./wishlist.route');

const router = express.Router();

router.use('/wishlist', wishlistRoutes);

module.exports = router;
