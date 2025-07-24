import { findOneAndDeleteDoc, findOneAndUpdateDoc, findOneDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProduct } from '@/models/product';
import { IUser } from '@/models/user';
import { IWishlist } from '@/models/wishlist';
import ApiError from '@/utils/ApiError';
import { CreateUpdateWishlistSchema } from '@/validations/wishlist.validation';
import httpStatus from 'http-status';

interface IOptions {
  user?: IUser;
}

/**
 * Create a Wishlist
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Wishlist>}
 */
export const createUpdateWishlist = async (
  reqBody: CreateUpdateWishlistSchema,
  options?: IOptions,
): Promise<{
  message: string;
  wishlistData: IWishlist | null;
}> => {
  const { productId } = reqBody;
  const user = options?.user;
  let message;

  /** Check product exists or not */
  const productExists = await findOneDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, {
    _id: productId,
  });

  if (!productExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  let wishlistData = await findOneDoc<IWishlist>(MONGOOSE_MODELS.WISHLIST, {
    product: productId,
    user: user?._id,
  });
  if (wishlistData) {
    await findOneAndDeleteDoc<IWishlist>(MONGOOSE_MODELS.WISHLIST, {
      product: productExists._id,
      user: user?._id,
    });
    message = 'Wishlist removed successfully!!';
  } else {
    wishlistData = await findOneAndUpdateDoc<IWishlist>(
      MONGOOSE_MODELS.WISHLIST,
      {
        user: user?._id,
        product: productExists._id,
      },
      {
        user: user?._id,
        product: productExists._id,
      },
      {
        new: true,
        upsert: true,
      },
    );

    message = 'Wishlist added successfully!!';
  }
  return {
    message,
    wishlistData,
  };
};
