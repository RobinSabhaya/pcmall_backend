const httpStatus = require('http-status');
const wishlistService = require('../../services/wishlist/wishlist.service');
const productService = require('../../services/product/product.service');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const addRemoveWishlist = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;
  try {
    let message;

    /** Check product exists or not */
    const productExists = await productService.getProduct({
      _id: productId,
    });

    if (!productExists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    let wishlistData = await wishlistService.getWishlist({ product: productId, user: user._id });
    if (wishlistData) {
      await wishlistService.removeWishlist({
        product: productExists._id,
        user: user._id,
      });
      message = 'Wishlist removed successfully!!';
    } else {
      wishlistData = await wishlistService.createWishlist(
        {
          user: user._id,
          product: productExists._id,
        },
        {
          user: user._id,
          product: productExists._id,
        },
        {
          new: true,
          upsert: true,
        }
      );

      message = 'Wishlist added successfully!!';
    }
    return res.status(httpStatus.OK).json({
      success: true,
      data: wishlistData,
      message,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  addRemoveWishlist,
};
