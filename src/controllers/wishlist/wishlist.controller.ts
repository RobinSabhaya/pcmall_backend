import httpStatus from 'http-status';
import * as wishlistService from '@/services/wishlist/wishlist.service';
import ApiError from '../../utils/ApiError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUpdateWishlistSchema } from '@/validations/wishlist.validation';
import { IUser } from '@/models/user';

export const addRemoveWishlist = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user as IUser;
  const options = { user };
  try {
    const { message, wishlistData } = await wishlistService.createUpdateWishlist(
      request.body as CreateUpdateWishlistSchema,
      options,
    );

    return reply.status(httpStatus.OK).send({
      success: true,
      data: wishlistData,
      message,
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};
