const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const productService = require('../../services/product/product.service');


const getAllProducts = catchAsync(async (req, res) => {
  try {
    let { categories, colors, prices, ...options } = req.query;

    categories = JSON.parse(categories || '[]');
    colors = JSON.parse(colors || '[]');
    prices = JSON.parse(prices || '{}');

    const filter = {
      $or: [],
    };

    // Set categories
    if (categories?.length) {
      filter.categories = {
        $in: categories,
      };
    }

    // Set colors
    if (colors.length) {
      filter.colors = {
        colors: { $in: colors },
      };
    }

    // Set prices
    if (prices) {
      filter.prices = {
        price: { $gte: prices?.min || 0, $lte: prices?.max || 10000 },
      };
    }

    if (!filter.$or.length) delete filter.$or;

    // Get all cart data
    const productData = await productService.getAllProducts(filter, {
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    return res.status(httpStatus.OK).json({
      success: true,
      data: productData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  getAllProducts,
};
