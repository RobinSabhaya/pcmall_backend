const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { findOneAndUpdateDoc, findOneDoc, findOneAndDeleteDoc } = require('../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
require('../../models/inventory');

const createUpdateInventory = catchAsync(async (req, res) => {
  try {
    const { inventoryId, skuId, warehouseId, ...reqBody } = req.body;

    let inventoryData, productSkuData, warehouseData, message;

    if (skuId) {
      productSkuData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_SKU, { _id: skuId });

      if (!productSkuData) throw new ApiError(httpStatus.NOT_FOUND, 'Product sku not found');
    }

    if (warehouseId) {
      warehouseData = await findOneDoc(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId });

      if (!warehouseData) throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');
    }

    /** Create and Update Inventory*/
    if (inventoryId) {
      /** Get inventory */
      inventoryData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_INVENTORY, { _id: inventoryId });

      if (!inventoryData) throw new ApiError(httpStatus.NOT_FOUND, 'Product Inventory not found');

      const payload = {
        sku: skuId,
        warehouse: warehouseId,
        ...reqBody,
        updatedBy: req.user._id,
      };

      inventoryData = await findOneAndUpdateDoc(MONGOOSE_MODELS.PRODUCT_INVENTORY, { _id: inventoryId }, payload, {
        upsert: true,
        new: true,
      });
      message = 'Product Inventory update successfully';
    } else {
      const payload = {
        sku: skuId,
        warehouse: warehouseId,
        ...reqBody,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      };
      inventoryData = await findOneAndUpdateDoc(MONGOOSE_MODELS.PRODUCT_INVENTORY, payload, payload, {
        upsert: true,
        new: true,
      });
      message = 'Product Inventory create successfully';
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: inventoryData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const deleteInventory = catchAsync(async (req, res) => {
  try {
    const { inventoryId } = req.query;

    let inventoryData, message;

    /** Get inventory */
    inventoryData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_INVENTORY, { _id: inventoryId });

    if (!inventoryData) throw new ApiError(httpStatus.NOT_FOUND, 'Product Inventory not found');

    inventoryData = await findOneAndDeleteDoc(MONGOOSE_MODELS.PRODUCT_INVENTORY, { _id: inventoryId });
    message = 'Product Inventory delete successfully';

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: inventoryData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const getAllInventory = catchAsync(async (req, res) => {
  try {
    const inventoryData = await find(MONGOOSE_MODELS.PRODUCT_INVENTORY, {});

    return res.status(httpStatus.OK).json({
      success: true,
      data: inventoryData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  createUpdateInventory,
  deleteInventory,
  getAllInventory,
};
