import { status as httpStatus } from 'http-status';
import { FilterQuery } from 'mongoose';

import { PAYMENTSTATUS } from '@/helpers/constant.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IUser } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';
import {
  AddToCartSchema,
  UpdateToCartSchema,
} from '@/validations/cart.validation';

import {
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  IPaginationResponse,
  paginationQuery,
} from '../../helpers/mongoose.helper';
import { cart, ICart } from '../../models/cart/cart.model';
import { toDeepObject } from '../../utils/custom.util';

interface IOptions {
  user: IUser;
}

export const createCart = async (
  reqBody: AddToCartSchema,
  options: IOptions
): Promise<{
  message: string;
  cartData: ICart | null;
}> => {
  const { productVariantId, quantity } = reqBody;
  const { user } = options;
  let message = null;
  /** Check product exists or not */
  const productVariantExists = await findOneDoc(
    MONGOOSE_MODELS.PRODUCT_VARIANT,
    {
      _id: productVariantId,
    }
  );

  if (!productVariantExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
  }

  const cartData = await findOneAndUpdateDoc<ICart>(
    MONGOOSE_MODELS.CART,
    {
      variant: productVariantExists._id,
      user: user._id,
      quantity,
      status: PAYMENTSTATUS.PENDING,
    },
    {
      variant: productVariantExists._id,
      user: user._id,
      quantity,
    },
    {
      upsert: true,
      new: true,
    }
  );
  message = 'Cart added successfully';

  return {
    message,
    cartData: toDeepObject(cartData) as ICart,
  };
};

export const updateToCart = async (
  reqBody: UpdateToCartSchema
): Promise<{
  message: string;
  cartData: ICart | null;
}> => {
  const { cartId, quantity } = reqBody;
  let message = null;
  /** Check product exists or not */
  const cartExists = await findOneDoc<ICart>(MONGOOSE_MODELS.CART, {
    _id: cartId,
  });

  if (!cartExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const cartData = await findOneAndUpdateDoc<ICart>(
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
    }
  );
  message = 'Cart updated successfully';

  return {
    message,
    cartData: toDeepObject(cartData) as ICart,
  };
};

export const removeCart = async (
  reqBody: FilterQuery<ICart>,
  options = {}
): Promise<{
  cartData: ICart | null;
  message: string;
}> => {
  const { cartId } = reqBody as Partial<UpdateToCartSchema>;
  let message = null;

  /** Check cart exists or not */
  const cartExists = await getCart({ _id: cartId });

  if (!cartExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const cartData = await findOneAndDeleteDoc<ICart>(
    MONGOOSE_MODELS.CART,
    { _id: cartExists._id },
    options
  );

  message = 'Cart removed successfully';

  return {
    message,
    cartData: toDeepObject(cartData) as ICart,
  };
};

export const getCart = async (
  filter: FilterQuery<ICart>,
  options = {}
): Promise<ICart | null> => {
  return findOneDoc<ICart>(MONGOOSE_MODELS.CART, filter, options);
};

export const getAllCart = async (
  filter: FilterQuery<ICart>,
  options = {}
): Promise<IPaginationResponse<ICart>[]> => {
  const pagination = paginationQuery(options);
  return cart.aggregate([
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
