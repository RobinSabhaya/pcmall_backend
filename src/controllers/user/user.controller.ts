import { FastifyReply, FastifyRequest } from 'fastify';
import * as userService from '../../services/user/user.service';
import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import {
  DeleteAddressSchema,
  UpdateAddressSchema,
  UpdateUserSchema,
} from '@/validations/user.validation';
import { IUser } from '@/models/user';
import { Schema } from 'mongoose';

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user as IUser;
  const options = { user };

  try {
    const { message, userData } = await userService.updateUser(
      request.body as UpdateUserSchema,
      options,
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: userData,
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

/** Get user */
export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user as IUser;

  try {
    /** get user */
    const userData = await userService.getUser({
      _id: user?._id,
    });

    if (!userData.length) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    return reply.code(httpStatus.OK).send({
      success: true,
      data: userData[0],
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

export const updateAddress = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { addressData } = await userService.updateAddress(request.body as UpdateAddressSchema);

    return reply.code(httpStatus.OK).send({
      success: true,
      message: 'Address updated successfully!',
      data: addressData,
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

export const deleteAddress = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { addressData } = await userService.deleteAddress(request.params as DeleteAddressSchema);

    return reply.code(httpStatus.OK).send({
      success: true,
      message: 'Address delete successfully',
      data: addressData,
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};
