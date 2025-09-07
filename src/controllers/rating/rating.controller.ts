import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { IUser } from '@/models/user';
import * as fileService from '@/services/common/file.service';
import * as ratingService from '@/services/rating/rating.service';
import ApiError from '@/utils/apiErrorHandler';
import * as ratingValidation from '@/validations/rating.validation';
import {
  GetRatingCountSchema,
  GetRatingListSchema,
} from '@/validations/rating.validation';
/**
 * Create Rating
 */
export const createUpdateRating = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const user = request.user as IUser;
  const options = { user };

  const parts = request.parts();

  const fields: Record<string, unknown> = {};

  for await (const part of parts) {
    if (part.type === 'file') {
      const fileName = fileService.generateFileName({
        originalname: part.filename,
      });

      const isPromise = fileService.saveFiles([
        {
          fileUploadType: 'single',
          fileBuffer: await part.toBuffer(),
          fileMimeType: part.mimetype as string,
          fileName,
          fileSize: 1111,
        },
      ]);

      if (isPromise != null) fields['images'] = [fileName];
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  const parsed = ratingValidation.createUpdateRating.body.safeParse(fields);
  if (!parsed.success) {
    // Remove if anything fails
    delete fields['images'];
    throw new ApiError(httpStatus.BAD_REQUEST, String(parsed.error.message));
  }

  try {
    const { message, ratingData } = await ratingService.createUpdateRating(
      fields,
      options
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { ratingData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

/**
 * Get rating list
 */
export const getRatingList = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const user = request.user as IUser;
    const { ratingData } = await ratingService.getRatingList(
      request.query as GetRatingListSchema,
      {
        user,
      }
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: {
        results: ratingData[0]?.results,
        totalResults: ratingData[0].totalResults,
        page: ratingData[0].page,
        limit: ratingData[0].limit,
        totalPages: ratingData[0].totalPages,
      },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

/** Get rating count */
export const getRatingCount = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const user = request.user as IUser;
    /** Get rating count */
    const ratingCount = await ratingService.getRatingCount(
      request.query as GetRatingCountSchema,
      {
        user,
      }
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: {
        ratingCount: ratingCount[0],
      },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

/** Delete rating */
export const deleteRating = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    /** Get rating */
    const ratingData = await ratingService.deleteRating(
      request.query as ratingValidation.DeleteRatingSchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message: 'Rating deleted successfully',
      data: { ratingData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
