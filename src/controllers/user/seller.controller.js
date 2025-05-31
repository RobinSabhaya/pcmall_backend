const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { findOneAndUpdateDoc, findOneDoc, findOneAndDeleteDoc, createDoc } = require('../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
const { USER_ROLE } = require('../../helpers/constant.helper');

const createUpdateSeller = catchAsync(async (req, res) => {
  try {
    const { sellerId, password, email, confirm_password, ...reqBody } = req.body;

    let sellerData, userData, message;

    // Match password and confirm password
    if (password != confirm_password) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

    /** Create and Update Seller */
    if (sellerId) {
      /** Get seller */
      sellerData = await findOneDoc(MONGOOSE_MODELS.SELLER, { _id: sellerId });

      if (!sellerData) throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');

      sellerData = await findOneAndUpdateDoc(MONGOOSE_MODELS.SELLER, { _id: sellerId }, reqBody, {
        upsert: true,
        new: true,
      });

      message = 'Seller update successfully';
    } else {
      userData = await createDoc(MONGOOSE_MODELS.USER, {
        email: reqBody.businessEmail,
        password,
        roles: [USER_ROLE.SELLER],
      });

      sellerData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.SELLER,
        { ...reqBody, user: userData._id },
        { ...reqBody, user: userData._id },
        {
          upsert: true,
          new: true,
        }
      );

      message = 'Seller create successfully';
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: sellerData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const deleteSeller = catchAsync(async (req, res) => {
  try {
    const { sellerId } = req.query;

    let sellerData, message;

    /** Get seller */
    sellerData = await findOneDoc(MONGOOSE_MODELS.SELLER, { _id: sellerId });

    if (!sellerData) throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');

    sellerData = await findOneAndDeleteDoc(MONGOOSE_MODELS.SELLER, { _id: sellerId });
    await findOneAndDeleteDoc(MONGOOSE_MODELS.USER, { _id: sellerData.user });
    message = 'Seller delete successfully';

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: sellerData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const getAllSellers = catchAsync(async (req, res) => {
  try {
    const sellerData = await find(MONGOOSE_MODELS.SELLER, {});

    return res.status(httpStatus.OK).json({
      success: true,
      data: sellerData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  createUpdateSeller,
  deleteSeller,
  getAllSellers,
};
