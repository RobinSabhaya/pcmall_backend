import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import * as sellerService from '@/services/user/seller.service';
import {
  CreateUpdateSellerSchema,
  DeleteSellerSchema,
} from '@/validations/seller.validation';

import ApiError from '../../utils/apiErrorHandler';

export const createUpdateSeller = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { message, sellerData } = await sellerService.createUpdateSeller(
      request.body as CreateUpdateSellerSchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { sellerData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const deleteSeller = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { message, sellerData } = await sellerService.deleteSeller(
      request.query as DeleteSellerSchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { sellerData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const getAllSellers = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { sellerData } = await sellerService.getAllSellers({});

    return reply.code(httpStatus.OK).send({
      success: true,
      data: { sellerData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
