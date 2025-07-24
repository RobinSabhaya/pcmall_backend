import httpStatus from 'http-status';
import ApiError from '@/utils/ApiError';
import * as productBrandService from '@/services/product/productBrand.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createUpdateBrandSchema } from '@/validations/brand.validation';
import { IUser } from '@/models/user';

export const createUpdateBrand = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as IUser;
    const { message, brandData } = await productBrandService.createUpdateBrand(
      request.body as createUpdateBrandSchema,
      { user },
    );
    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: brandData,
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

export const deleteBrand = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as IUser;
    const { message, brandData } = await productBrandService.deleteBrand(
      request.query as Partial<createUpdateBrandSchema>,
      { user },
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: brandData,
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

export const getAllBrands = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const brandData = await productBrandService.getAllBrands({});

    return reply.code(httpStatus.OK).send({
      success: true,
      data: brandData,
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};
