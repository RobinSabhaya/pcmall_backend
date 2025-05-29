const Wishlist = require('../../models/wishlist/wishlist.model');

/**
 * Create a Wishlist
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Wishlist>}
 */
const createWishlist = (filter, reqBody, options = {}) => {
  return Wishlist.findOneAndUpdate(filter, reqBody, options);
};

/**
 * remove a Wishlist
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Wishlist>}
 */
const removeWishlist = (filter, options = {}) => {
  return Wishlist.findOneAndDelete(filter, options);
};

/**
 * Get a Wishlist
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Wishlist>}
 */
const getWishlist = (filter, options = {}) => {
  return Wishlist.findOne(filter, options);
};

module.exports = {
  createWishlist,
  removeWishlist,
  getWishlist,
};
