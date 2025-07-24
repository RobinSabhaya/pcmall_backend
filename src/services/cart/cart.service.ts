import { Cart, ICart } from '../../models/cart/cart.model';
import { config } from '../../config/config';
import {
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  paginationQuery,
  PaginationResponse,
} from '../../helpers/mongoose.helper';
import { FilterQuery, PipelineStage, UpdateQuery } from 'mongoose';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import ApiError from '@/utils/ApiError';
import httpStatus from 'http-status';
import { PAYMENT_STATUS } from '@/helpers/constant.helper';
import { AddToCartSchema, UpdateToCartSchema } from '@/validations/cart.validation';
import { IUser } from '@/models/user';

interface IOptions {
  user: IUser;
}

/**
 * Create a cart
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Cart>}
 */
export const createCart = async (
  reqBody: AddToCartSchema,
  options: IOptions,
): Promise<ICart | null> => {
  const { productVariantId, quantity } = reqBody;
  const { user } = options;
  /** Check product exists or not */
  const productVariantExists = await findOneDoc(MONGOOSE_MODELS.PRODUCT_VARIANT, {
    _id: productVariantId,
  });

  if (!productVariantExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }

  return findOneAndUpdateDoc<ICart>(
    MONGOOSE_MODELS.CART,
    {
      variant: productVariantExists._id,
      user: user._id,
      quantity,
      status: PAYMENT_STATUS.PENDING,
    },
    {
      variant: productVariantExists._id,
      user: user._id,
      quantity,
    },
    {
      upsert: true,
      new: true,
    },
  );
};

/**
 * Create a cart
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Cart>}
 */
export const updateToCart = async (
  reqBody: UpdateToCartSchema,
  options: IOptions,
): Promise<ICart | null> => {
  const { cartId, quantity } = reqBody;
  const { user } = options;
  /** Check product exists or not */
  const cartExists = await findOneDoc<ICart>(MONGOOSE_MODELS.CART, {
    _id: cartId,
  });

  if (!cartExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  return findOneAndUpdateDoc<ICart>(
    MONGOOSE_MODELS.CART,
    {
      _id: cartExists._id,
    },
    {
      quantity,
    },
    {
      upsert: true,
      new: true,
    },
  );
};

/**
 * remove a cart
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Cart>}
 */
export const removeCart = async (
  reqBody: FilterQuery<ICart>,
  options = {},
): Promise<ICart | null> => {
  const { cartId } = reqBody as Partial<UpdateToCartSchema>;

  /** Check cart exists or not */
  const cartExists = await getCart({ _id: cartId });

  if (!cartExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  return findOneAndDeleteDoc<ICart>(MONGOOSE_MODELS.CART, { _id: cartExists._id }, options);
};

/**
 * Get a cart
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Cart>}
 */
export const getCart = (filter: FilterQuery<ICart>, options = {}): Promise<ICart | null> => {
  return findOneDoc<ICart>(MONGOOSE_MODELS.CART, filter, options);
};

/**
 * Get all cart
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Cart>}
 */
export const getAllCart = async (
  filter: FilterQuery<ICart>,
  options = {},
): Promise<PaginationResponse<ICart>[]> => {
  const pagination = paginationQuery(options);
  return await Cart.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $lookup: {
        from: 'product_variants',
        localField: 'variant',
        foreignField: '_id',
        pipeline: [
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
        ],
        as: 'product_variants',
      },
    },
    {
      $unwind: {
        path: '$product_variants',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product_variants.product',
        foreignField: '_id',
        pipeline: [
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
        ],
        as: 'product',
      },
    },
    {
      $unwind: {
        path: '$product',
        preserveNullAndEmptyArrays: true,
      },
    },
    ...pagination,
  ]);
};
