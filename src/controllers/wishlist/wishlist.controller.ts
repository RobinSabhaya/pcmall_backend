import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { IUser } from '@/models/user';
import * as wishlistService from '@/services/wishlist/wishlist.service';
import { CreateUpdateWishlistSchema } from '@/validations/wishlist.validation';

import ApiError from '../../utils/apiErrorHandler';

export const addRemoveWishlist = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const user = request.user as IUser;
  const options = { user };
  try {
    const { message, wishlistData } =
      await wishlistService.createUpdateWishlist(
        request.body as CreateUpdateWishlistSchema,
        options
      );

    return reply.status(httpStatus.OK).send({
      success: true,
      data: wishlistData,
      message,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
