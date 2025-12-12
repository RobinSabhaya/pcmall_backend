/* eslint-disable max-lines */
import { status as httpStatus } from 'http-status';
import { FilterQuery, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import ApiError from '@/utils/apiErrorHandler';
import {
  CreateUpdateProductSchema,
  DeleteProductSchema,
  GenerateProductSkuSchema,
  GetAllProductsSchema,
} from '@/validations/product.validation';

import { PAYMENTSTATUS, USERROLE } from '../../helpers/constant.helper';
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
// eslint-disable-next-line complexity
export const getAllProducts = async (
  reqQuery: GetAllProductsSchema,
  options: IOptions
): Promise<IProduct[]> => {
  const user = options?.user;

  const filter = generateProductFilter(reqQuery);

  const pagination = paginationQuery({
    page: Number(reqQuery.page ?? 1),
    limit: Number(reqQuery.limit ?? 10),
    ...(reqQuery?.sortBy != '' && { sortBy: reqQuery.sortBy }),
    ...(reqQuery?.search != '' && { search: reqQuery.search }),
    ...(user &&
      user?.roles.length > 0 &&
      user?.roles.includes(USERROLE.SELLER) === true && {
        createdBy: new Types.ObjectId(String(user?._id)),
        updatedBy: new Types.ObjectId(String(user?._id)),
      }),
  });

  return toDeepObject(
    await product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
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
        $match: {
          ...(filter?.categories && {
            'category.categoryName': filter?.categories,
          }),
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
          from: 'wishlists',
          localField: '_id',
          foreignField: 'product',
          pipeline: [
            {
              $match: {
                ...(user
                  ? {
                      user: new Types.ObjectId(String(user?._id)),
                    }
                  : {
                      user: new Types.ObjectId(),
                    }),
              },
            },
          ],
          as: 'wishlistProduct',
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
                from: 'carts',
                localField: '_id',
                foreignField: 'variant',
                pipeline: [
                  {
                    $match: {
                      ...(user
                        ? {
                            user: new Types.ObjectId(String(user?._id)),
                          }
                        : {
                            user: new Types.ObjectId(),
                          }),
                      status: PAYMENTSTATUS.PENDING,
                    },
                  },
                ],
                as: 'cartProduct',
              },
            },
            {
              $lookup: {
                from: 'product_skus',
                localField: '_id',
                foreignField: 'variant',
                as: 'product_skus',
              },
            },
            {
              $unwind: {
                path: '$product_skus',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                isInCart: {
                  $cond: [{ $gt: [{ $size: '$cartProduct' }, 0] }, true, false],
                },
              },
            },
          ],
          as: 'product_variants',
        },
      },
      {
        $addFields: {
          isInWishlist: {
            $cond: [{ $gt: [{ $size: '$wishlistProduct' }, 0] }, true, false],
          },
        },
      },
      {
        $match: {
          ...(filter?.productId && { _id: filter.productId }),
          ...(filter?.slug != null && { slug: filter.slug }),
          ...(filter?.gender && { 'category.tags': filter?.gender }),
          ...(filter?.prices && {
            'product_variants.product_skus.price': filter?.prices?.price,
          }),
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
  let {
    categories,
    // colors,
    prices,
    gender,
  } = reqQuery;
  const { productId, slug } = reqQuery;

  categories = JSON.parse(JSON.stringify(categories ?? '[]'));
  // colors = JSON.parse(JSON.stringify(colors ?? '[]'));
  prices = JSON.parse(JSON.stringify(prices ?? '{}'));
  gender = JSON.parse(JSON.stringify(gender ?? '[]'));

  const filter: IGetAllProductsFilter = {};
  if (categories != null) {
    filter.categories = buildArrayFilter(JSON.parse(categories));
  }

  if (gender != null) {
    filter.gender = buildArrayFilter(JSON.parse(gender));
  }

  // if (colors != null) {
  //   filter.colors = buildArrayFilter(JSON.parse(colors));
  // }

  if (prices != null) {
    filter.prices = buildPriceFilter(JSON.parse(prices));
  }

  if (productId != null) filter.productId = new Types.ObjectId(productId);

  if (slug != null) filter.slug = slug;

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
