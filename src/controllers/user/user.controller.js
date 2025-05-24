const mongoose = require('mongoose');
const userService = require('../../services/user/user.service');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const updateUser = catchAsync(async (req, res) => {
  const userId = req.user._id;

  try {
    await userService.updateManyAddress(
      {
        user: userId,
      },
      {
        isPrimary: false,
      }
    );

    const addressData = await userService.addAddress({
      user: userId,
      ...req.body,
      isPrimary: true,
    });

    const userData = await userService.updateUser(
      {
        _id: userId,
      },
      {
        ...req.body,
        primary_address: addressData._id,
      },
      {
        new: true,
      }
    );

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'User updated successfully!',
      data: userData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

/** Get user */
const getUser = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { options } = req.query;

  try {
    /** get user */
    const userData = await userService.getUser(
      {
        _id: new mongoose.Types.ObjectId(_id),
      },
      options
    );

    if (!userData.length) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    return res.status(httpStatus.OK).json({
      success: true,
      data: userData[0],
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const updateAddress = catchAsync(async (req, res) => {
  const { _id } = req.body;

  try {
    let addressData = await userService.getAddress({
      _id,
    });

    if (!addressData) throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');

    addressData = await userService.updateAddress(
      {
        _id,
      },
      req.body,
      {
        new: true,
      }
    );

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Address updated successfully!',
      data: addressData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const deleteAddress = catchAsync(async (req, res) => {
  const { _id } = req.params;

  try {
    let addressData = await userService.getAddress({ _id });

    if (addressData.isPrimary) throw new ApiError(httpStatus.NOT_FOUND, "You can't delete primary address.");

    addressData = await userService.deleteAddress({
      _id,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Address delete successfully',
      data: addressData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = { updateUser, getUser, updateAddress, deleteAddress };
