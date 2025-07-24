import {
  findOneAndUpdateDoc,
  findOneDoc,
  PaginationOptions,
  paginationQuery,
  PaginationResponse,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProduct } from '@/models/product';
import { IRating, Rating } from '@/models/rating';
import { IUser } from '@/models/user';
import ApiError from '@/utils/ApiError';
import {
  CreateUpdateRatingSchema,
  GetRatingCountSchema,
  GetRatingListSchema,
} from '@/validations/rating.validation';
import httpStatus from 'http-status';
import { FilterQuery, Types } from 'mongoose';
import { GetRatingListFilter, UserRating } from './rating.service.type';
import { handleStorage } from '../storage/storageStrategy';
import { config } from '@/config/config';

const {
  minIO: { fileStorageProvider },
} = config;

export interface IOptions extends PaginationOptions {
  user?: IUser;
}

export const createUpdateRating = async (
  reqBody: CreateUpdateRatingSchema,
  options?: IOptions,
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

  if (!productData) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

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
  //           // fileMainFolder: FILES_FOLDER.PUBLIC,
  //           fileUploadType: 'single',
  //           // subFolderName: FILES_FOLDER.TEMP,
  //           fileMimeType: file.mimetype,
  //           fileSize: file.size,
  //         },
  //       ]);
  //       uploadFiles.push(fileName);
  //     })
  //   );
  // }

  if (ratingId) {
    ratingData = await findOneAndUpdateDoc<IRating>(
      MONGOOSE_MODELS.RATING,
      { _id: ratingId },
      {
        ...rest,
        product: productData._id,
        ...(uploadFiles.length && { images: uploadFiles }),
      },
      {
        upsert: true,
        new: true,
      },
    );
    message = 'Rating updated successfully';
  } else {
    const ratingPayload = {
      ...rest,
      product: productData._id,
      user: user?._id,
      ...(uploadFiles.length && { images: uploadFiles }),
    };
    ratingData = await findOneAndUpdateDoc<IRating>(
      MONGOOSE_MODELS.RATING,
      ratingPayload,
      ratingPayload,
      {
        upsert: true,
        new: true,
      },
    );
    message = 'Rating created successfully';
  }

  return {
    message,
    ratingData,
  };
};

/**
 * Get Rating List
 * @param {object} reqQuery
 * @param {object} options
 * @returns {Promise<[Rating]>}
 */
export const getRatingList = async (
  reqQuery: GetRatingListSchema,
  options?: IOptions,
): Promise<{
  ratingData: PaginationResponse<IRating>[];
}> => {
  const { productId, rating } = reqQuery;
  const user = options?.user;

  const filter: GetRatingListFilter = {};

  if (productId) filter.product = new Types.ObjectId(productId);

  if (rating) filter.rating = +rating;
  if (user) filter.user = user?._id;
  console.log('🚀 ~ filter:', filter);

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
  ])) as PaginationResponse<IRating>[];

  if (Array(ratingData[0]?.results)?.length)
    await Promise.all(
      Array(ratingData[0]?.results)?.map(async (rating: UserRating) => {
        // For rating images
        if (!rating.images.includes('')) {
          rating.images = await Promise.all(
            rating.images.map((img) =>
              handleStorage(fileStorageProvider!).getFileLink({ fileName: img }),
            ),
          );
        } else {
          rating.images = [];
        }

        // For user profile picture
        if (rating?.user_profile?.profile_picture && rating?.user_profile?.profile_picture !== '') {
          rating.user_profile.profile_picture = await handleStorage(
            fileStorageProvider!,
          ).getFileLink({
            fileName: rating.user_profile.profile_picture,
          });
        }

        return rating;
      }),
    );

  return {
    ratingData,
  };
};

/**
 * Get Rating Count
 * @param {object} reqQuery
 * @param {object} options
 * @returns {Promise<[Rating]>}
 */
export const getRatingCount = (reqQuery: GetRatingCountSchema, options?: IOptions) => {
  const { productId, rating } = reqQuery;
  const user = options?.user;

  const filter: GetRatingListFilter = {};

  if (productId) filter.product = new Types.ObjectId(String(productId));

  if (rating) filter.rating = +rating;
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
