const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const productService = require('../../services/product/product.service');
const { findOneAndUpdateDoc, findOneDoc, findOneAndDeleteDoc, findDoc } = require('../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
const { generateSKU } = require('../../helpers/function.helper');

const getAllProducts = catchAsync(async (req, res) => {
  try {
    let { categories, colors, prices, ...options } = req.query;

    categories = JSON.parse(categories || '[]');
    colors = JSON.parse(colors || '[]');
    prices = JSON.parse(prices || '{}');

    const filter = {
      $or: [],
    };

    // Set categories
    if (categories?.length) {
      filter.categories = {
        $in: categories,
      };
    }

    // Set colors
    if (colors.length) {
      filter.colors = {
        colors: { $in: colors },
      };
    }

    // Set prices
    if (prices) {
      filter.prices = {
        price: { $gte: prices?.min || 0, $lte: prices?.max || 10000 },
      };
    }

    if (!filter.$or.length) delete filter.$or;

    // Get all cart data
    const productData = await productService.getAllProducts(filter, {
      user: new mongoose.Types.ObjectId(req.user._id),
      ...options,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      data: productData[0],
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const createUpdateProduct = catchAsync(async (req, res) => {
  try {
    const { productId, variantId, name, attributeCombination, images, ...reqBody } = req.body;

    let productData, productVariantData, message;

    /** Create and Update Product */
    if (productId) {
      /** Get product */
      productData = await findOneDoc(MONGOOSE_MODELS.PRODUCT, { _id: productId });

      if (!productData) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

      productData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.PRODUCT,
        { _id: productId },
        { ...reqBody, updatedBy: req.user._id },
        {
          upsert: true,
          new: true,
        }
      );

      if (variantId) {
        /** Get product variant */
        productVariantData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_VARIANT, { _id: variantId });

        if (!productVariantData) throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');

        const payload = {
          product: productData._id,
          name,
          attributeCombination,
          images,
          updatedBy: req.user._id,
        };

        productVariantData = await findOneAndUpdateDoc(MONGOOSE_MODELS.PRODUCT_VARIANT, { _id: variantId }, payload, {
          upsert: true,
          new: true,
        });
      }

      message = 'Product update successfully';
    } else {
      productData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.PRODUCT,
        { ...reqBody, createdBy: req.user._id, updatedBy: req.user._id },
        { ...reqBody, createdBy: req.user._id, updatedBy: req.user._id },
        {
          upsert: true,
          new: true,
        }
      );

      const payload = {
        product: productData._id,
        name,
        attributeCombination,
        images,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      };

      productVariantData = await findOneAndUpdateDoc(MONGOOSE_MODELS.PRODUCT_VARIANT, payload, payload, {
        upsert: true,
        new: true,
      });

      message = 'Product create successfully';
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: { productData, productVariantData },
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const deleteProduct = catchAsync(async (req, res) => {
  try {
    const { productId } = req.query;

    let productData, message;

    /** Get product */
    productData = await findOneDoc(MONGOOSE_MODELS.PRODUCT, { _id: productId });

    if (!productData) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

    productData = await findOneAndDeleteDoc(MONGOOSE_MODELS.PRODUCT, { _id: productId });
    await findOneAndDeleteDoc(MONGOOSE_MODELS.PRODUCT_VARIANT, { product: productId });
    await findOneAndDeleteDoc(MONGOOSE_MODELS.PRODUCT_SKU, { product: productId });

    message = 'Product delete successfully';

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: productData,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const generateProductSku = catchAsync(async (req, res) => {
  try {
    const { variantId, productSkuId, price, discount, tax } = req.body;

    let productData, productVariantData, productSkuData, message;

    /** Get product variant */
    productVariantData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_VARIANT, { _id: variantId });

    if (!productVariantData) throw new ApiError(httpStatus.NOT_FOUND, 'Product Variant not found');

    /** Get product */
    productData = await findOneDoc(
      MONGOOSE_MODELS.PRODUCT,
      { _id: productVariantData.product },
      {
        populate: [
          {
            path: 'brand',
            select: 'name',
          },
          {
            path: 'category',
            select: 'categoryName',
          },
        ],
      }
    );

    if (!productData) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

    const skuPayload = {
      name: productData.title,
      category: productData?.category?.categoryName || 'category',
      brand: productData?.brand?.name || 'brand',
      variants: productVariantData?.attributeCombination,
    };

    const payload = {
      variant: productVariantData._id,
      product: productData._id,
      skuCode: generateSKU(skuPayload),
      price,
      discount,
      tax,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };

    if (productSkuId) {
      productSkuData = await findOneAndUpdateDoc(MONGOOSE_MODELS.PRODUCT_SKU, { _id: productSkuId }, payload, {
        upsert: true,
        new: true,
      });
      message = 'Product Sku update successfully';
    } else {
      productSkuData = await findOneAndUpdateDoc(MONGOOSE_MODELS.PRODUCT_SKU, payload, payload, {
        upsert: true,
        new: true,
      });
      message = 'Generate Product Sku successfully';
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message,
      data: { productData, productSkuData },
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

module.exports = {
  createUpdateProduct,
  deleteProduct,
  getAllProducts,
  generateProductSku,
};
