const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { findOneAndUpdateDoc, findOneDoc, findOneAndDeleteDoc } = require('../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');

const createUpdateBrand = catchAsync(async (req, res) => {
  try {
    const { brandId } = req.body;

    let brandData, message;

    /** Create and Update Brand */
    if (brandId) {
      /** Get brand */
      brandData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_BRAND, { _id: brandId });

      if (!brandData) throw new ApiError(httpStatus.NOT_FOUND, 'Product Brand not found');

      brandData = await findOneAndUpdateDoc(MONGOOSE_MODELS.PRODUCT_BRAND, { _id: brandId }, req.body, {
        upsert: true,
        new: true,
      });
      message = 'Product Brand update successfully';
    } else {
      brandData = await findOneAndUpdateDoc(MONGOOSE_MODELS.PRODUCT_BRAND, req.body, req.body, {
        upsert: true,
        new: true,
      });
      message = 'Product Brand create successfully';
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: brandData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const deleteBrand = catchAsync(async (req, res) => {
  try {
    const { brandId } = req.query;

    let brandData, message;

    /** Get brand */
    brandData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_BRAND, { _id: brandId });

    if (!brandData) throw new ApiError(httpStatus.NOT_FOUND, 'Product Brand not found');

    brandData = await findOneAndDeleteDoc(MONGOOSE_MODELS.PRODUCT_BRAND, { _id: brandId });
    message = 'Product Brand delete successfully';

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: brandData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const getAllBrands = catchAsync(async (req, res) => {
  try {
    const brandData = await find(MONGOOSE_MODELS.PRODUCT_BRAND, {});

    return res.status(httpStatus.OK).json({
      success: true,
      data: brandData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  createUpdateBrand,
  deleteBrand,
  getAllBrands,
};
