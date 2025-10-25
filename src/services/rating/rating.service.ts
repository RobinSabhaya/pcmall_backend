import { status as httpStatus } from 'http-status';
import { Types } from 'mongoose';

import { config } from '@/config/config';
import {
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  IPaginationOptions,
  IPaginationResponse,
  paginationQuery,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProduct } from '@/models/product';
import { IRating, rating as Rating } from '@/models/rating';
import { IUser } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';
import {
  CreateUpdateRatingSchema,
  DeleteRatingSchema,
  GetRatingCountSchema,
  GetRatingListSchema,
} from '@/validations/rating.validation';

import { handleStorage } from '../storage/storageStrategy';

import { IGetRatingListFilter, IUserRating } from './rating.service.type';

const {
  minIO: { fileStorageProvider },
} = config;

export interface IOptions extends IPaginationOptions {
  user?: IUser;
}

export const createUpdateRating = async (
  reqBody: CreateUpdateRatingSchema,
  options?: IOptions
): Promise<{
  message: string;
  ratingData: IRating | null;
}> => {
  const { productId, ratingId, ...rest } = reqBody;
  const user = options?.user;
  let ratingData, message;
  /** Check product */
  const productData = await findOneDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, {
    _id: productId,
  });

  if (!productData)
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  const uploadFiles: Array<string> = [];
  // TODO: files pending
  // if (files?.length) {
  //   await Promise.all(
  //     files.map(async (file) => {
  //       const fileName = await fileService.generateFileName(file);
  //       await fileService.saveFiles([
  //         {
  //           fileName,
  //           fileBuffer: file.buffer,
  //           // fileMainFolder: FILESFOLDER.PUBLIC,
  //           fileUploadType: 'single',
  //           // subFolderName: FILESFOLDER.TEMP,
  //           fileMimeType: file.mimetype,
  //           fileSize: file.size,
  //         },
  //       ]);
  //       uploadFiles.push(fileName);
  //     })
  //   );
  // }

  if (ratingId != null) {
    ratingData = await findOneAndUpdateDoc<IRating>(
      MONGOOSE_MODELS.RATING,
      { _id: ratingId },
      {
        ...rest,
        product: productData._id,
        ...(uploadFiles?.length > 0 ? { images: uploadFiles } : []),
        user: user?._id,
      },
      {
        upsert: true,
        new: true,
      }
    );
    message = 'rating updated successfully';
  } else {
    const ratingPayload = {
      ...rest,
      product: productData._id,
      user: user?._id,
      ...(uploadFiles?.length > 0 && { images: uploadFiles }),
    };
    ratingData = await findOneAndUpdateDoc<IRating>(
      MONGOOSE_MODELS.RATING,
      ratingPayload,
      ratingPayload,
      {
        upsert: true,
        new: true,
      }
    );
    message = 'rating created successfully';
  }

  return {
    message,
    ratingData,
  };
};

/**
 * Get rating List
 * @param {object} reqQuery
 * @param {object} options
 * @returns {Promise<[rating]>}
 */
export const getRatingList = async (
  reqQuery: GetRatingListSchema,
  options?: IOptions
): Promise<{
  ratingData: IPaginationResponse<IRating>[];
}> => {
  const { productId, rating } = reqQuery;
  const user = options?.user;

  const filter: IGetRatingListFilter = {};

  if (productId != null) filter.product = new Types.ObjectId(productId);

  if (rating != null) filter.rating = +rating;
  if (user) filter.user = user?._id;

  const pagination = paginationQuery(options!);
  const ratingData = (await Rating.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $lookup: {
        from: 'user_profiles',
        localField: 'user',
        foreignField: 'user',
        as: 'user_profile',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user_profile',
      },
    },
    ...pagination,
  ])) as IPaginationResponse<IRating>[];

  await Promise.all(
    (ratingData[0]?.results as unknown as IRating[])?.map(
      async (rating: IUserRating) => {
        // For rating images
        rating.images = !rating?.images?.includes('')
          ? await Promise.all(
              rating?.images?.map(async img =>
                handleStorage(fileStorageProvider!).getFileLink({
                  fileName: img,
                })
              )
            )
          : [];

        // For user profile picture
        if (rating?.user_profile?.profile_picture != null) {
          rating.user_profile.profile_picture = await handleStorage(
            fileStorageProvider!
          ).getFileLink({
            fileName: rating.user_profile.profile_picture,
          });
        }

        return rating;
      }
    )
  );

  return {
    ratingData,
  };
};

/**
 * Get rating Count
 * @param {object} reqQuery
 * @param {object} options
 * @returns {Promise<[rating]>}
 */
export const getRatingCount = async (
  reqQuery: GetRatingCountSchema,
  options?: IOptions
): Promise<IRating[]> => {
  const { productId, rating } = reqQuery;
  const user = options?.user;

  const filter: IGetRatingListFilter = {};

  if (productId != null) filter.product = new Types.ObjectId(String(productId));

  if (rating != null) filter.rating = +rating;
  if (user) filter.user = user?._id;

  return Rating.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: '$product',
        avg_rating: {
          $avg: '$rating',
        },
        user: {
          $addToSet: '$user',
        },
        rating_count: {
          $sum: 1,
        },
        one_star: {
          $sum: {
            $cond: {
              if: {
                $eq: ['$rating', 1],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
        two_star: {
          $sum: {
            $cond: {
              if: {
                //
                $eq: ['$rating', 2],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
        three_star: {
          $sum: {
            $cond: {
              if: {
                //
                $eq: ['$rating', 3],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
        four_star: {
          $sum: {
            $cond: {
              if: {
                //
                $eq: ['$rating', 4],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
        five_star: {
          $sum: {
            $cond: {
              if: {
                //
                $eq: ['$rating', 5],
              },
              then: {
                $sum: 1,
              },
              else: 0,
            },
          },
        },
      },
    },
  ]);
};

export const deleteRating = async (
  payload: DeleteRatingSchema
): Promise<IRating | null> => {
  const { ratingId } = payload as DeleteRatingSchema;

  const ratingData = await findOneDoc<IRating>(MONGOOSE_MODELS.RATING, {
    _id: ratingId,
  });

  if (ratingData == null)
    throw new ApiError(httpStatus.NOT_FOUND, 'Rating not found');

  return findOneAndDeleteDoc<IRating>(MONGOOSE_MODELS.RATING, {
    _id: ratingData._id,
  });
};
