const { User, Address } = require('../../models/user');
const { handleStorage } = require('../storage/storageStrategy');
const { minIO: { fileStorageProvider} } = require('../../config/config')

/**
 * Create user
 * @param {object} reqBody
 * @returns {Promise<User>}
 */
const createUser = (reqBody) => {
  return User.create(reqBody);
};

/**
 * Update user
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<User>}
 */
const updateUser = (filter, reqBody, options = {}) => {
  return User.findOneAndUpdate(filter, reqBody, options);
};

/**
 * Update user
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Address>}
 */
const updateManyAddress = (filter, reqBody, options = {}) => {
  return Address.updateMany(filter, reqBody, options);
};

/**
 * Add a address
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Address>}
 */
const addAddress = (reqBody, options = {}) => {
  return Address.create(reqBody);
};

/**
 * Update a address
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Address>}
 */
const updateAddress = (filter, reqBody, options = {}) => {
  return Address.findOneAndUpdate(filter, reqBody, options);
};

/**
 * Get a address
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Address>}
 */
const getAddress = (filter, options = {}) => {
  return Address.findOne(filter);
};

/**
 * Get a address
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Address>}
 */
const getFilterUser = (filter, options = {}) => {
  return User.findOne(filter);
};

/**
 * Get a user
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<User>}
 */
const getUser = async (filter, options = {}) => {
  const userData = await User.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $lookup: {
        from: 'addresses',
        localField: '_id',
        foreignField: 'user',
        as: 'addresses',
        pipeline: [
          {
            $sort: {
              createdAt: -1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'addresses',
        localField: 'primary_address',
        foreignField: '_id',
        as: 'primary_address',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$primary_address',
      },
    },
    {
      $lookup: {
        from: 'user_profiles',
        localField: '_id',
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
  ]);

  return await Promise.all(
    userData.map(async (user) => {
      if (user.user_profile?.profile_picture && user.user_profile.profile_picture !== '') {
        user.user_profile.profile_picture = await handleStorage(fileStorageProvider).getFileLink({ fileName: user.user_profile.profile_picture });
      } else {
        user.user_profile.profile_picture = null;
      }

      return user;
    })
  );
};

/**
 * Get a address
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Address>}
 */
const deleteAddress = (filter, options = {}) => {
  return Address.findOneAndDelete(filter);
};

module.exports = {
  createUser,
  updateUser,
  updateManyAddress,
  addAddress,
  getUser,
  updateAddress,
  getAddress,
  deleteAddress,
  getFilterUser,
};
