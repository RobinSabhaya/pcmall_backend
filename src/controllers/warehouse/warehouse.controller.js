const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { findOneAndUpdateDoc, findOneDoc, findOneAndDeleteDoc } = require('../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
require('../../models/warehouse/');

const createUpdateWarehouse = catchAsync(async (req, res) => {
  try {
    const { warehouseId, sellerId, addressId, ...reqBody } = req.body;

    let warehouseData, sellerData, message;

    if (sellerId) {
      sellerData = await findOneDoc(MONGOOSE_MODELS.SELLER, { _id: sellerId });

      if (!sellerData) throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
    }

    /** Create and Update Inventory*/
    if (warehouseId) {
      /** Get inventory */
      warehouseData = await findOneDoc(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId });

      if (!warehouseData) throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');

      const payload = {
        seller: sellerId,
        address: addressId,
        ...reqBody,
        updatedBy: req.user._id,
      };

      warehouseData = await findOneAndUpdateDoc(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId }, payload, {
        upsert: true,
        new: true,
      });
      message = 'Warehouse update successfully';
    } else {
      const payload = {
        seller: sellerId,
        address: addressId,
        ...reqBody,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      };

      warehouseData = await findOneAndUpdateDoc(MONGOOSE_MODELS.WAREHOUSE, payload, payload, {
        new: true,
        upsert: true,
      });
      message = 'Warehouse create successfully';
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: warehouseData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const deleteWarehouse = catchAsync(async (req, res) => {
  try {
    const { warehouseId } = req.query;

    let warehouseData, message;

    /** Get inventory */
    warehouseData = await findOneDoc(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId });

    if (!warehouseData) throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');

    warehouseData = await findOneAndDeleteDoc(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId });
    message = 'Warehouse delete successfully';

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: warehouseData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const getAllWarehouse = catchAsync(async (req, res) => {
  try {
    const warehouseData = await find(MONGOOSE_MODELS.WAREHOUSE, {});

    return res.status(httpStatus.OK).json({
      success: true,
      data: warehouseData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  createUpdateWarehouse,
  deleteWarehouse,
  getAllWarehouse,
};
