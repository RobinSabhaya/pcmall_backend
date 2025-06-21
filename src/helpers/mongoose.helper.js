const mongoose = require('mongoose');
/**
 * Pagination query
 * @param {Object} options
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {Array} stages
 * @returns
 */
const paginationQuery = (options, stages = []) => {
  let { page, limit, sortBy } = options;

  page = page ? +page : 1;
  limit = limit ? +limit : 10;

  const sort = {};
  if (sortBy) {
    sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sort[key] = order === 'desc' ? -1 : 1;
    });
  } else sort._id = -1;

  const query = [
    {
      $sort: sort,
    },
    {
      $facet: {
        pagination: [
          {
            $count: 'totalResults',
          },
          {
            $addFields: {
              page,
              limit,
              totalPages: {
                $ceil: {
                  $divide: ['$totalResults', limit],
                },
              },
            },
          },
        ],
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }, ...stages],
      },
    },
    {
      $unwind: {
        path: '$pagination',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              results: '$data',
            },
            '$pagination',
          ],
        },
      },
    },
    {
      $unwind: {
        path: '$pagination',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  return query;
};

/**
 * Create doc
 * @param {string} modelName
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<mongoose.model>}
 */
const createDoc = (modelName, reqBody, options = {}) => {
  return mongoose.model(modelName).create(reqBody);
};

/**
 * Find one and Update doc
 * @param {string} modelName
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<mongoose.model>}
 */
const findOneAndUpdateDoc = (modelName, filter, reqBody, options = {}) => {
  return mongoose.model(modelName).findOneAndUpdate(filter, reqBody, options);
};

/**
 * Find one and Delete doc
 * @param {string} modelName
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<mongoose.model>}
 */
const findOneAndDeleteDoc = (modelName, filter, options = {}) => {
  return mongoose.model(modelName).findOneAndDelete(filter);
};

/**
 * Find one doc
 * @param {string} modelName
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<mongoose.model>}
 */
const findOneDoc = (modelName, filter, options = {}) => {
  return mongoose
    .model(modelName)
    .findOne(filter)
    .populate(options?.populate || [])
    .sort(options?.sort || {});
};

/**
 * Find doc
 * @param {string} modelName
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<mongoose.model>}
 */
const findDoc = (modelName, filter, options = {}) => {
  return mongoose
    .model(modelName)
    .find(filter)
    .populate(options?.populate || [])
    .sort(options?.sort || {});
};

/**
 * Update Many docs
 * @param {string} modelName
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<mongoose.model>}
 */
const updateManyDoc = (modelName, filter, reqBody, options = {}) => {
  return mongoose.model(modelName).updateMany(filter, reqBody);
};

module.exports = {
  paginationQuery,
  createDoc,
  findOneAndUpdateDoc,
  findOneAndDeleteDoc,
  findOneDoc,
  findDoc,
  updateManyDoc,
};
