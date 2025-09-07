import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { IUser } from '@/models/user';
import * as productBrandService from '@/services/product/productBrand.service';
import ApiError from '@/utils/apiErrorHandler';
import { CreateUpdateBrandSchema } from '@/validations/brand.validation';

export const createUpdateBrand = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const user = request.user as IUser;
    const { message, brandData } = await productBrandService.createUpdateBrand(
      request.body as CreateUpdateBrandSchema,
      { user }
    );
    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { brandData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const deleteBrand = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    // const user = request.user as IUser;
    const { message, brandData } = await productBrandService.deleteBrand(
      request.query as Partial<CreateUpdateBrandSchema>
      // { user }
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { brandData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const getAllBrands = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const brandData = await productBrandService.getAllBrands({});

    return reply.code(httpStatus.OK).send({
      success: true,
      data: { brandData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
