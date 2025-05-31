const express = require('express');
const productRoutes = require('./product.route');
const productBrandRoutes = require('./productBrand.route');

const router = express.Router();

router.use('/product', productRoutes);

router.use('/product-brand', productBrandRoutes);

module.exports = router;
