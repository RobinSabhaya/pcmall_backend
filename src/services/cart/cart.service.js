const Cart = require('../../models/cart/cart.model');
const {
  common: { imageUrl },
} = require('../../config/config');
const { paginationQuery } = require('../../helpers/mongoose.helper');

/**
 * Create a cart
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Cart>}
 */
const createCart = (filter, reqBody, options = {}) => {
  return Cart.findOneAndUpdate(filter, reqBody, options);
};

/**
 * remove a cart
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Cart>}
 */
const removeCart = (filter, options = {}) => {
  return Cart.findOneAndDelete(filter, options);
};

/**
 * Get a cart
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Cart>}
 */
const getCart = (filter, options = {}) => {
  return Cart.findOne(filter, options);
};

/**
 * Get all cart
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Cart>}
 */
const getAllCart = async (filter, options = {}) => {
  const pagination = paginationQuery(options);
  return await Cart.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $lookup: {
        from: 'product_variants',
        localField: 'variant',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'product_skus',
              localField: '_id',
              foreignField: 'variant',
              as: 'product_skus',
            },
          },
          {
            $unwind: {
              path: '$product_skus',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        as: 'product_variants',
      },
    },
    {
      $unwind: {
        path: '$product_variants',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product_variants.product',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'product_brands',
              localField: 'brand',
              foreignField: '_id',
              as: 'brand',
            },
          },
          {
            $unwind: {
              path: '$brand',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        as: 'product',
      },
    },
    {
      $unwind: {
        path: '$product',
        preserveNullAndEmptyArrays: true,
      },
    },
    ...pagination,
  ]);
};

module.exports = {
  createCart,
  removeCart,
  getCart,
  getAllCart,
};
