const { Category } = require('../../models/category');

/**
 * Get ALL categories
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Category>}
 */
const getAllCategories = (filter, options) => {
  if (options?.populate) return Category.find(filter).populate(options.populate);

  return Category.find(filter);
};

module.exports = { getAllCategories };
