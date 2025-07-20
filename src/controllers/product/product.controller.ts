import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import * as productService from "../../services/product/product.service";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateUpdateProductSchema,
  DeleteProductSchema,
  GenerateProductSkuSchema,
  GetAllProductsSchema,
} from "@/validations/product.validation";
import { IUser } from "@/models/user";

export const getAllProducts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
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
    if (error instanceof Error)
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Something went wrong"
      );
  }
};

export const createUpdateProduct = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { message, productData, productVariantData } =
      await productService.createUpdateProduct(
        request.body as CreateUpdateProductSchema
      );
    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { productData, productVariantData },
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Something went wrong"
      );
  }
};

export const deleteProduct = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
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
    if (error instanceof Error)
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Something went wrong"
      );
  }
};

export const generateProductSku = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
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
    if (error instanceof Error)
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Something went wrong"
      );
  }
};
