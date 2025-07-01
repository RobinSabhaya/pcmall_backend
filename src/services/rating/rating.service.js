const { Rating } = require('../../models/rating');
const { paginationQuery } = require('../../helpers/mongoose.helper');
const { handleStorage } = require('../../services/storage/storageStrategy');
const {
  minIO: { fileStorageProvider },
} = require('../../config/config');

/**
 * Get Rating List
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Rating]>}
 */
const getRatingList = async (filter, options) => {
  const { product } = filter;
  const pagination = paginationQuery(options);
  const ratingData = await Rating.aggregate([
    {
      $match: {
        product,
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

  if (ratingData[0]?.results?.length)
    return await Promise.all(
      ratingData[0]?.results.map(async (rating) => {
        // For rating images
        if (!rating.images.includes(null) && !rating.images.includes('')) {
          rating.images = await Promise.all(
            rating.images.map((img) => handleStorage(fileStorageProvider).getFileLink({ fileName: img }))
          );
        } else {
          rating.images = [];
        }

        // For user profile picture
        if (rating.user_profile?.profile_picture && rating.user_profile.profile_picture !== '') {
          rating.user_profile.profile_picture = await handleStorage(fileStorageProvider).getFileLink({
            fileName: rating.user_profile.profile_picture,
          });
        } else {
          rating.user_profile.profile_picture = null;
        }

        return rating;
      })
    );
};

/**
 * Get Rating Count
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Rating]>}
 */
const getRatingCount = (filter, options) => {
  const { product } = filter;
  return Rating.aggregate([
    {
      $match: {
        product,
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
