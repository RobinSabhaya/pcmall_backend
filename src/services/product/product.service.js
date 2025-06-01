const { Product } = require('../../models/product');
const {
  common: { imageUrl },
} = require('../../config/config');
const { paginationQuery } = require('../../helpers/mongoose.helper');

/**
 * Get product
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Product>}
 */
const getProduct = (filter, options = {}) => {
  return Product.findOne(filter, options);
};

/**
 * Get all product
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Product]>}
 */
const getAllProducts = (filter, options = {}) => {
  const { user } = options;
  const pagination = paginationQuery(options);
  return Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              ...(filter?.categories && { categoryName: filter?.categories }),
            },
          },
        ],
        as: 'category',
      },
    },
    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },
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
    {
      $lookup: {
        from: 'product_variants',
        localField: '_id',
        foreignField: 'product',
        pipeline: [
          {
            $lookup: {
              from: 'product_skus',
              localField: '_id',
              foreignField: 'variant',
              pipeline: [
                {
                  $match: {
                    ...(filter.prices && { ...filter.prices }),
                  },
                },
              ],
              as: 'product_skus',
            },
          },
        ],
        as: 'product_variants',
      },
    },
    {
      $lookup: {
        from: 'carts',
        localField: '_id',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              user,
            },
          },
        ],
        as: 'cartProduct',
      },
    },
    {
      $lookup: {
        from: 'wishlists',
        localField: '_id',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              user,
            },
          },
        ],
        as: 'wishlistProducts',
      },
    },
    {
      $addFields: {
        img: {
          $map: {
            input: '$img',
            as: 'image',
            in: {
              $cond: [
                {
                  $and: [
                    {
                      $ne: ['$image', ''],
                      $ne: ['$image', null],
                    },
                  ],
                },
                {
                  $concat: [imageUrl, 'uploads/', '$$image'],
                },
                [],
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        isInCart: {
          $cond: [{ $gt: [{ $size: '$cartProduct' }, 0] }, true, false],
        },
        isInWishlist: {
          $cond: [{ $gt: [{ $size: '$wishlistProducts' }, 0] }, true, false],
        },
        cartProduct: null,
        wishlistProducts: null,
      },
    },
    ...pagination,
  ]);
};

module.exports = {
  getProduct,
  getAllProducts,
};
