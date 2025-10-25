import { FastifyReply, FastifyRequest } from 'fastify';
import { status as httpStatus } from 'http-status';

import { IUser } from '@/models/user';
import {
  DeleteAddressSchema,
  UpdateAddressSchema,
  UpdateUserSchema,
} from '@/validations/user.validation';

import * as userService from '../../services/user/user.service';
import ApiError from '../../utils/apiErrorHandler';

export const updateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const user = request.user as IUser;
  const options = { user };

  try {
    const { message, userData } = await userService.updateUser(
      request.body as UpdateUserSchema,
      options
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { userData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

/** Get user */
export const getUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const user = request.user as IUser;

  try {
    /** get user */
    const userData = await userService.getUser({
      _id: user?._id,
    });

    if (userData.length === 0)
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    return reply.code(httpStatus.OK).send({
      success: true,
      data: { userData: userData[0] },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const updateAddress = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { addressData } = await userService.updateAddress(
      request.body as UpdateAddressSchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message: 'Address updated successfully!',
      data: { addressData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const deleteAddress = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { addressData } = await userService.deleteAddress(
      request.query as DeleteAddressSchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message: 'Address delete successfully',
      data: { addressData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
