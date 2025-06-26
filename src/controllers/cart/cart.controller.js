const productService = require('../../services/product/product.service');
const cartService = require('../../services/cart/cart.service');
const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const { findOneDoc } = require('../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
const { PAYMENT_STATUS } = require('../../helpers/constant.helper');

const addToCart = catchAsync(async (req, res) => {
  const { productVariantId, quantity } = req.body;

  /** Check product exists or not */
  const productVariantExists = await findOneDoc(MONGOOSE_MODELS.PRODUCT_VARIANT, {
    _id: productVariantId,
  });

  if (!productVariantExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }

  /** create cart */
  const cartData = await cartService.createCart(
    {
      variant: productVariantExists._id,
      user: req.user._id,
      quantity,
      status: PAYMENT_STATUS.PENDING,
    },
    {
      variant: productVariantExists._id,
      user: req.user._id,
      quantity,
    },
    {
      upsert: true,
      new: true,
    }
  );

  return res.status(httpStatus.OK).json({
    success: true,
    data: cartData,
    message: 'Cart added successfully',
  });
});

const updateToCart = catchAsync(async (req, res) => {
  try {
    const { cartId, quantity } = req.body;

    /** Check cart exists or not */
    const cartExists = await cartService.getCart({ _id: cartId });

    if (!cartExists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }

    /** create cart */
    const cartData = await cartService.createCart(
      {
        _id: cartId,
      },
      {
        quantity,
      },
      {
        new: true,
      }
    );

    return res.status(httpStatus.OK).json({
      success: true,
      data: cartData,
      message: 'Cart updated successfully',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const removeToCart = catchAsync(async (req, res) => {
  try {
    const { cartId } = req.params;

    /** Check cart exists or not */
    const cartExists = await cartService.getCart({ _id: cartId });

    if (!cartExists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }

    /** create cart */
    await cartService.removeCart({
      _id: cartId,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Cart removed successfully',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const getAllCart = catchAsync(async (req, res) => {
  try {
    const { ...options } = req.query;

    // Get all cart data
    const cartData = await cartService.getAllCart(
      {
        user: new mongoose.Types.ObjectId(req.user._id),
        status: PAYMENT_STATUS.PENDING,
      },
      options
    );

    const totalQty = cartData[0]?.results?.reduce((acc, c) => {
      return acc + c?.quantity;
    }, 0);

    const totalPrice = cartData[0]?.results?.reduce((acc, c) => {
      return acc + c?.product_variants?.product_skus?.price * c?.quantity;
    }, 0);

    return res.status(httpStatus.OK).json({
      success: true,
      data: {
        items: cartData[0] || [],
        totalQty,
        totalPrice,
      },
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  addToCart,
  updateToCart,
  removeToCart,
  getAllCart,
};
