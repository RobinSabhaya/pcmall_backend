const Cart = require('../../models/cart/cart.model');
const IMAGE_URL = process.env.IMAGE_URL;

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
  return await Cart.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        pipeline: [
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
                        $concat: [IMAGE_URL, 'uploads/', '$$image'],
                      },
                      [],
                    ],
                  },
                },
              },
            },
          },
        ],
        as: 'productId',
      },
    },
    {
      $unwind: {
        path: '$productId',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
};

module.exports = {
  createCart,
  removeCart,
  getCart,
  getAllCart,
};
