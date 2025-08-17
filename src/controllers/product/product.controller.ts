import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { IUser } from '@/models/user';
import {
  CreateUpdateProductSchema,
  DeleteProductSchema,
  GenerateProductSkuSchema,
  GetAllProductsSchema,
} from '@/validations/product.validation';

import * as productService from '../../services/product/product.service';
import ApiError from '../../utils/apiErrorHandler';

export const getAllProducts = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const user = request.user as IUser;
    // Get all cart data
    const productData = await productService.getAllProducts(
      request.query as GetAllProductsSchema,
      {
        user,
      }
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: productData[0],
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const createUpdateProduct = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const user = request.user as IUser;
  try {
    const { message, productData, productVariantData } =
      await productService.createUpdateProduct(
        request.body as CreateUpdateProductSchema,
        { user }
      );
    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { productData, productVariantData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const deleteProduct = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { message, productData } = await productService.deleteProduct(
      request.query as DeleteProductSchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: productData,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const generateProductSku = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const user = request.user as IUser;
    const { message, productData, productSkuData } =
      await productService.generateProductSku(
        request.body as GenerateProductSkuSchema,
        { user }
      );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { productData, productSkuData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
