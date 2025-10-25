import { FastifyReply, FastifyRequest } from 'fastify';
import { status as httpStatus } from 'http-status';

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
      message,
      data: { wishlistData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
