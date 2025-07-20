import { IProduct, IProductSKU, IProductVariant, Product } from "../../models/product";
import {
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  PaginationOptions,
  paginationQuery,
} from "../../helpers/mongoose.helper";
import { PAYMENT_STATUS } from "../../helpers/constant.helper";
import { FilterQuery, Schema } from "mongoose";
import { MONGOOSE_MODELS } from "@/helpers/mongoose.model.helper";
import "@/models/product/productVariant.model";
import { IUser } from "@/models/user";
import {
  CreateUpdateProductSchema,
  DeleteProductSchema,
  GenerateProductSkuSchema,
  GetAllProductsSchema,
} from "@/validations/product.validation";
import { GetAllProductsFilter } from "./product.service.type";
import ApiError from "@/utils/ApiError";
import httpStatus from "http-status";
import { generateSKU } from "@/helpers/function.helper";

export interface IOptions extends PaginationOptions {
  user?: IUser;
}

/**
 * Get product
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Product>}
 */
export const getProduct = (
  filter: FilterQuery<IProduct>,
  options = {}
): Promise<IProduct | null> => {
  return findOneDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, filter, options);
};

/**
 * Get all product
 * @param {object} reqQuery
 * @param {object} options
 * @returns {Promise<[Product]>}
 */
export const getAllProducts = async (
  reqQuery: GetAllProductsSchema,
  options?: IOptions
): Promise<IProduct[]> => {
  let { categories, colors, prices, productId } = reqQuery;
  const user = options?.user;
  categories = JSON.parse(categories || "[]");
  colors = JSON.parse(colors || "[]");
  prices = JSON.parse(prices || "{}");

  const filter: GetAllProductsFilter = {
    $or: [],
  };

  // Set categories
  if (categories?.length) {
    filter.categories = {
      $in: categories,
    };
  }

  // Set colors
  if (colors?.length) {
    filter.colors = {
      colors: { $in: colors },
    };
  }

  // Set prices
  if (prices) {
    filter.prices = {
      price: { $gte: prices?.min || 0, $lte: prices?.max || 1000000 },
    };
  }

  // For Single Product
  if (productId) {
    filter._id = new Schema.Types.ObjectId(productId);
  }

  if (!filter?.$or?.length) delete filter?.$or;
  const pagination = paginationQuery(options!);
  return Product.aggregate([
    {
      $match: {
        ...(filter?._id && { _id: filter._id }),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        pipeline: [
          {
            $match: {
              ...(filter?.categories && { categoryName: filter?.categories }),
            },
          },
        ],
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "product_brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    {
      $unwind: {
        path: "$brand",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "product_variants",
        localField: "_id",
        foreignField: "product",
        pipeline: [
          {
            $lookup: {
              from: "product_skus",
              localField: "_id",
              foreignField: "variant",
              pipeline: [
                {
                  $match: {
                    ...(filter.prices && { ...filter.prices }),
                  },
                },
              ],
              as: "product_skus",
            },
          },
          {
            $unwind: {
              path: "$product_skus",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        as: "product_variants",
      },
    },
    {
      $unwind: {
        path: "$product_variants",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "carts",
        localField: "_id",
        foreignField: "product",
        pipeline: [
          {
            $match: {
              user: new Schema.Types.ObjectId(String(user?._id)),
              status: PAYMENT_STATUS.PENDING,
            },
          },
        ],
        as: "cartProduct",
      },
    },
    {
      $lookup: {
        from: "wishlists",
        localField: "_id",
        foreignField: "product",
        pipeline: [
          {
            $match: {
              user,
            },
          },
        ],
        as: "wishlistProducts",
      },
    },
    // {
    //   $addFields: {
    //     img: {
    //       $map: {
    //         input: '$img',
    //         as: 'image',
    //         in: {
    //           $cond: [
    //             {
    //               $and: [
    //                 {
    //                   $ne: ['$image', ''],
    //                   $ne: ['$image', null],
    //                 },
    //               ],
    //             },
    //             {
    //               $concat: [imageUrl, 'uploads/', '$$image'],
    //             },
    //             [],
    //           ],
    //         },
    //       },
    //     },
    //   },
    // },
    {
      $addFields: {
        isInCart: {
          $cond: [{ $gt: [{ $size: "$cartProduct" }, 0] }, true, false],
        },
        isInWishlist: {
          $cond: [{ $gt: [{ $size: "$wishlistProducts" }, 0] }, true, false],
        },
        cartProduct: null,
        wishlistProducts: null,
      },
    },
    ...pagination,
  ]);
};

export const createUpdateProduct = async (
  reqBody: CreateUpdateProductSchema,
  options?: IOptions
): Promise<{
  message: string;
  productData: IProduct | null;
  productVariantData: IProductVariant | null;
}> => {
  const { productId, variantId, name, attributeCombination, images, ...res } =
    reqBody;
  const user = options?.user;

  let productData, productVariantData, message;

  /** Create and Update Product */
  if (productId) {
    /** Get product */
    productData = await findOneDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, {
      _id: productId,
    });

    if (!productData)
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

    productData = await findOneAndUpdateDoc<IProduct>(
      MONGOOSE_MODELS.PRODUCT,
      { _id: productId },
      { ...reqBody, updatedBy: user?._id },
      {
        upsert: true,
        new: true,
      }
    );

    if (variantId) {
      /** Get product variant */
      productVariantData = await findOneDoc<IProductVariant>(MONGOOSE_MODELS.PRODUCT_VARIANT, {
        _id: variantId,
      });

      if (!productVariantData)
        throw new ApiError(httpStatus.NOT_FOUND, "Product variant not found");

      const payload = {
        product: productData?._id,
        name,
        attributeCombination,
        images,
        updatedBy: user?._id,
      };

      productVariantData = await findOneAndUpdateDoc<IProductVariant>(
        MONGOOSE_MODELS.PRODUCT_VARIANT,
        { _id: variantId },
        payload,
        {
          upsert: true,
          new: true,
        }
      );
    }

    message = "Product update successfully";
  } else {
    productData = await findOneAndUpdateDoc<IProduct>(
      MONGOOSE_MODELS.PRODUCT,
      { ...reqBody, createdBy: user?._id, updatedBy: user?._id },
      { ...reqBody, createdBy: user?._id, updatedBy: user?._id },
      {
        upsert: true,
        new: true,
      }
    );

    const payload = {
      product: productData?._id,
      name,
      attributeCombination,
      images,
      createdBy: user?._id,
      updatedBy: user?._id,
    };

    productVariantData = await findOneAndUpdateDoc<IProductVariant>(
      MONGOOSE_MODELS.PRODUCT_VARIANT,
      payload,
      payload,
      {
        upsert: true,
        new: true,
      }
    )

    message = "Product create successfully";
  }

  return {
    message,
    productData,
    productVariantData,
  };
};

export const deleteProduct = async (filter:DeleteProductSchema, options?: IOptions): Promise<{
  message: string;
  productData: IProduct | null
}> => {
  const { productId } = filter
  let productData, message;

  /** Get product */
  productData = await findOneDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, { _id: productId });

  if (!productData) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  productData = await findOneAndDeleteDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, { _id: productId });
  await findOneAndDeleteDoc<IProduct>(MONGOOSE_MODELS.PRODUCT_VARIANT, { product: productId });
  await findOneAndDeleteDoc<IProductSKU>(MONGOOSE_MODELS.PRODUCT_SKU, { product: productId });

  message = 'Product delete successfully';
  return {
    productData,
    message
  }
}

export const generateProductSku = async (reqBody: GenerateProductSkuSchema, options?: IOptions): Promise<{
  message: string;
  productData: IProduct | null;
  productSkuData: IProductSKU | null;
}> => { 
const { variantId, productSkuId, price, discount, tax } = reqBody;
  const user = options?.user as IUser;

    let productData, productVariantData, productSkuData, message;

    /** Get product variant */
    productVariantData = await findOneDoc<IProductVariant>(MONGOOSE_MODELS.PRODUCT_VARIANT, { _id: variantId });

    if (!productVariantData) throw new ApiError(httpStatus.NOT_FOUND, 'Product Variant not found');

    /** Get product */
    productData = await findOneDoc<IProduct>(
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
      createdBy: user?._id,
      updatedBy: user?._id,
    };

    if (productSkuId) {
      productSkuData = await findOneAndUpdateDoc<IProductSKU>(MONGOOSE_MODELS.PRODUCT_SKU, { _id: productSkuId }, payload, {
        upsert: true,
        new: true,
      });
      message = 'Product Sku update successfully';
    } else {
      productSkuData = await findOneAndUpdateDoc<IProductSKU>(MONGOOSE_MODELS.PRODUCT_SKU, payload, payload, {
        upsert: true,
        new: true,
      });
      message = 'Generate Product Sku successfully';
  }
  
  return {
    message,
    productData,
    productSkuData
  }
}