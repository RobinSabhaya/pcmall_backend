const { Product } = require('../../models/product');
const {
  common: { imageUrl },
} = require('../../config/config');

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
  return Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              categoryName: filter.categories,
            },
          },
        ],
        as: 'categoryId',
      },
    },
    {
      $unwind: {
        path: '$categoryId',
        preserveNullAndEmptyArrays: true,
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
    {
      $match: {
        ...(filter.prices && { ...filter.prices }),
        ...(filter.colors && { ...filter.colors }),
      },
    },
  ]);
};

module.exports = {
  getProduct,
  getAllProducts,
};
