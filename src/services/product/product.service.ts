import httpStatus from 'http-status';
import { FilterQuery, Schema } from 'mongoose';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import ApiError from '@/utils/apiErrorHandler';
import {
  CreateUpdateProductSchema,
  DeleteProductSchema,
  GenerateProductSkuSchema,
  GetAllProductsSchema,
} from '@/validations/product.validation';

import { PAYMENTSTATUS } from '../../helpers/constant.helper';
import {
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  IPaginationOptions,
  paginationQuery,
} from '../../helpers/mongoose.helper';
import {
  IProduct,
  IProductSKU,
  IProductVariant,
  product,
} from '../../models/product';
import { IUser } from '../../models/user';
import {
  buildArrayFilter,
  buildPriceFilter,
  toDeepObject,
} from '../../utils/custom.util';

import {
  IGetAllProductsFilter,
  IProductPopulated,
} from './product.service.type';
import { generateSKUPayload } from './product.service.utils';

export interface IOptions extends IPaginationOptions {
  user?: IUser;
}

export const getProduct = async (
  filter: FilterQuery<IProduct>,
  options = {}
): Promise<IProduct | null> => {
  return findOneDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, filter, options);
};

/**
 * Get all product
 * @param {object} reqQuery
 * @param {object} options
 * @returns {Promise<[product]>}
 */
export const getAllProducts = async (
  reqQuery: GetAllProductsSchema,
  options?: IOptions
): Promise<IProduct[]> => {
  const user = options?.user;

  const filter = generateProductFilter(reqQuery);

  const pagination = paginationQuery(options!);
  return toDeepObject(
    await product.aggregate([
      {
        $match: {
          ...(filter?._id && { _id: filter._id }),
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                ...(filter?.categories && { categoryName: filter?.categories }),
              },
            },
          ],
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'product_brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'product_variants',
          localField: '_id',
          foreignField: 'product',
          pipeline: [
            {
              $lookup: {
                from: 'product_skus',
                localField: '_id',
                foreignField: 'variant',
                pipeline: [
                  {
                    $match: {
                      ...(filter.prices && { ...filter.prices }),
                    },
                  },
                ],
                as: 'product_skus',
              },
            },
            {
              $unwind: {
                path: '$product_skus',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: 'product_variants',
        },
      },
      {
        $lookup: {
          from: 'carts',
          localField: '_id',
          foreignField: 'product',
          pipeline: [
            {
              $match: {
                user: new Schema.Types.ObjectId(String(user?._id)),
                status: PAYMENTSTATUS.PENDING,
              },
            },
          ],
          as: 'cartProduct',
        },
      },
      {
        $lookup: {
          from: 'wishlists',
          localField: '_id',
          foreignField: 'product',
          pipeline: [
            {
              $match: {
                user,
              },
            },
          ],
          as: 'wishlistProducts',
        },
      },
      {
        $addFields: {
          isInCart: {
            $cond: [{ $gt: [{ $size: '$cartProduct' }, 0] }, true, false],
          },
          isInWishlist: {
            $cond: [{ $gt: [{ $size: '$wishlistProducts' }, 0] }, true, false],
          },
          cartProduct: null,
          wishlistProducts: null,
        },
      },
      ...pagination,
    ])
  ) as IProduct[];
};

export const createUpdateProduct = async (
  reqBody: CreateUpdateProductSchema,
  options?: IOptions
): Promise<{
  message: string;
  productData: IProduct | null;
  productVariantData: IProductVariant | null;
}> => {
  const user = options?.user;

  // Handle product creation/update
  const { productData, message } = await handleProductOperation(reqBody, {
    user,
  });

  let productVariantData: IProductVariant | null = null;
  productVariantData = await handleVariantOperation(
    { ...reqBody, productId: String(productData?._id) },
    { user }
  );

  return {
    message,
    productData: toDeepObject(productData) as IProduct,
    productVariantData: toDeepObject(productVariantData) as IProductVariant,
  };
};

export const deleteProduct = async (
  filter: DeleteProductSchema
): Promise<{
  message: string;
  productData: IProduct | null;
}> => {
  const { productId } = filter;
  let productData,
    message = '';

  /** Get product */
  productData = await findOneDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, {
    _id: productId,
  });

  if (!productData)
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');

  productData = await findOneAndDeleteDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, {
    _id: productId,
  });
  await findOneAndDeleteDoc<IProduct>(MONGOOSE_MODELS.PRODUCT_VARIANT, {
    product: productId,
  });
  await findOneAndDeleteDoc<IProductSKU>(MONGOOSE_MODELS.PRODUCT_SKU, {
    product: productId,
  });

  message = 'product delete successfully';
  return {
    productData: toDeepObject(productData) as IProduct,
    message,
  };
};

export const generateProductSku = async (
  reqBody: GenerateProductSkuSchema,
  options?: IOptions
): Promise<{
  message: string;
  productData: IProductPopulated | null;
  productSkuData: IProductSKU | null;
}> => {
  const { variantId } = reqBody;
  const user = options?.user;
  /** Get product variant */
  const productVariantData = await findOneDoc<IProductVariant>(
    MONGOOSE_MODELS.PRODUCT_VARIANT,
    {
      _id: variantId,
    }
  );

  if (!productVariantData)
    throw new ApiError(httpStatus.NOT_FOUND, 'product Variant not found');

  /** Get product */
  const productData = await findOneDoc<IProductPopulated>(
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

  if (!productData)
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');

  const { productSkuData, message } = await handleProductSkuOperation({
    productData,
    productVariantData,
    reqBody,
    options: { user },
  });

  return {
    message,
    productData: toDeepObject(productData) as IProductPopulated,
    productSkuData: toDeepObject(productSkuData) as IProductSKU,
  };
};

export const generateProductFilter = (
  reqQuery: GetAllProductsSchema
): IGetAllProductsFilter => {
  let { categories, colors, prices } = reqQuery;

  categories = JSON.parse(String(categories ?? '[]'));
  colors = JSON.parse(String(colors ?? '[]'));
  prices = JSON.parse(String(prices ?? '{}'));

  const filter: IGetAllProductsFilter = {};

  const categoryFilter = buildArrayFilter(categories!);
  if (categoryFilter) filter.categories = categoryFilter;

  const colorFilter = buildArrayFilter(colors!);
  if (colorFilter) filter.colors = colorFilter;

  const priceFilter = buildPriceFilter(prices!);
  if (priceFilter) filter.prices = priceFilter;

  return filter;
};

export const handleProductOperation = async (
  payload: CreateUpdateProductSchema,
  options: IOptions
): Promise<{ productData: IProduct | null; message: string }> => {
  const { productId, ...rest } = payload;
  const { user } = options;

  const productPayload = {
    ...rest,
    createdBy: user?._id,
    updatedBy: user?._id,
  };

  // exclude the field
  delete productPayload.attributeCombination;
  delete productPayload.name;
  delete productPayload.images;

  if (productId != null) {
    // Update existing product
    const existingProduct = await findOneDoc<IProduct>(
      MONGOOSE_MODELS.PRODUCT,
      {
        _id: productId,
      }
    );

    if (!existingProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }

    const productData = await findOneAndUpdateDoc<IProduct>(
      MONGOOSE_MODELS.PRODUCT,
      { _id: productId },
      { ...productPayload, updatedBy: user?._id },
      {
        upsert: true,
        new: true,
      }
    );

    return { productData, message: 'product update successfully' };
  } else {
    // Create new product
    const productData = await findOneAndUpdateDoc<IProduct>(
      MONGOOSE_MODELS.PRODUCT,
      productPayload,
      productPayload,
      {
        upsert: true,
        new: true,
      }
    );

    return { productData, message: 'product create successfully' };
  }
};

export const handleVariantOperation = async (
  payload: CreateUpdateProductSchema,
  options: IOptions
): Promise<IProductVariant | null> => {
  const { variantId, productId, name, attributeCombination } = payload;
  const { user } = options;

  const productVariantPayload = {
    product: productId,
    name,
    attributeCombination,
    createdBy: user?._id,
    updatedBy: user?._id,
  };

  if (variantId != null) {
    // Update existing variant
    const existingVariant = await findOneDoc<IProductVariant>(
      MONGOOSE_MODELS.PRODUCT_VARIANT,
      {
        _id: variantId,
      }
    );

    if (!existingVariant) {
      throw new ApiError(httpStatus.NOT_FOUND, 'product variant not found');
    }

    return findOneAndUpdateDoc<IProductVariant>(
      MONGOOSE_MODELS.PRODUCT_VARIANT,
      { _id: variantId },
      { ...productVariantPayload, updatedBy: user?._id },
      {
        upsert: true,
        new: true,
      }
    );
  } else {
    return findOneAndUpdateDoc<IProductVariant>(
      MONGOOSE_MODELS.PRODUCT_VARIANT,
      productVariantPayload,
      productVariantPayload,
      {
        upsert: true,
        new: true,
      }
    );
  }
};

export const handleProductSkuOperation = async (payload: {
  productData: IProductPopulated;
  productVariantData: IProductVariant;
  reqBody: GenerateProductSkuSchema;
  options: IOptions;
}): Promise<{
  productSkuData: IProductSKU | null;
  message: string;
}> => {
  const {
    productData,
    productVariantData,
    reqBody: { productSkuId, price, discount, tax },
    options,
  } = payload;
  const { user } = options;
  let productSkuData, message;

  const productSKUPayload = generateSKUPayload({
    productData,
    productVariantData,
    price,
    discount,
    tax,
  });

  const productSKUPayloadData = Object.assign(
    {
      createdBy: user?._id,
      updatedBy: user?._id,
    },
    productSKUPayload
  ) as IProductSKU;

  if (productSkuId != null) {
    productSkuData = await findOneAndUpdateDoc<IProductSKU>(
      MONGOOSE_MODELS.PRODUCT_SKU,
      { _id: productSkuId },
      { ...productSKUPayloadData },
      {
        upsert: true,
        new: true,
      }
    );
    message = 'product Sku update successfully';
  } else {
    productSkuData = await findOneAndUpdateDoc<IProductSKU>(
      MONGOOSE_MODELS.PRODUCT_SKU,
      {},
      { ...productSKUPayloadData, updatedBy: user?._id } as IProductSKU,
      {
        upsert: true,
        new: true,
      }
    );
    message = 'Generate product Sku successfully';
  }
  return {
    productSkuData,
    message,
  };
};
