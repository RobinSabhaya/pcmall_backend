import { IUser } from "@/models/user";
import * as ratingService from "@/services/rating/rating.service";
import ApiError from "@/utils/ApiError";
import {
  CreateUpdateRatingSchema,
  GetRatingCountSchema,
  GetRatingListSchema,
} from "@/validations/rating.validation";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
/**
 * Create Rating
 */
export const createRating = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as IUser;
  const options = { user };
  try {
    const { message, ratingData } = await ratingService.createUpdateRating(
      request.body as CreateUpdateRatingSchema,
      options
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: ratingData,
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Something went wrong"
      );
  }
};

/**
 * Get rating list
 */
export const getRatingList = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as IUser;
    const { ratingData } = await ratingService.getRatingList(
      request.query as GetRatingListSchema,
      { user }
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
    if (error instanceof Error)
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Something went wrong"
      );
  }
};

/** Get rating count */
export const getRatingCount = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as IUser;
    /** Get rating count */
    const ratingCount = await ratingService.getRatingCount(
      request.query as GetRatingCountSchema,
      { user }
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: {
        ratingCount: ratingCount[0],
      },
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Something went wrong"
      );
  }
};
