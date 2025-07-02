const { Rating } = require('../../models/rating');
const { paginationQuery } = require('../../helpers/mongoose.helper');

/**
 * Get Rating List
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Rating]>}
 */
const getRatingList = (filter, options) => {
  const pagination = paginationQuery(options);
  return Rating.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $lookup: {
        from: 'user_profiles',
        localField: 'user',
        foreignField: 'user',
        as: 'user_profile',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user_profile',
      },
    },
    ...pagination,
  ]);
};

/**
 * Get Rating Count
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Rating]>}
 */
const getRatingCount = (filter, options) => {
  return Rating.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: '$product',
        avg_rating: {
          $avg: '$rating',
        },
        user: {
          $addToSet: '$user',
        },
        rating_count: {
          $sum: 1,
        },
        one_star: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$rating', 1],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
        two_star: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$rating', 2],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
        three_star: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$rating', 3],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
        four_star: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$rating', 4],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
        five_star: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$rating', 5],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
      },
    },
  ]);
};

module.exports = { getRatingList, getRatingCount };
