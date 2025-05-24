const {Rating} = require('../../models/rating/index');

/**
 * Create a rating
 * @param {object} reqBody
 * @returns {Promise<Rating>}
 */
const createRating = (reqBody) => {
  return Rating.create(reqBody);
};

module.exports = { createRating };
