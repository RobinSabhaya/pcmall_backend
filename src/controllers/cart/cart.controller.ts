import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { ICart } from '@/models/cart';
import { IUser } from '@/models/user';
import * as cartService from '@/services/cart/cart.service';
import {
  AddToCartSchema,
  UpdateToCartSchema,
} from '@/validations/cart.validation';

import { PAYMENTSTATUS } from '../../helpers/constant.helper';
import ApiError from '../../utils/apiErrorHandler';

import '@/models/product/productVariant.model';

export const addToCart = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const user = request.user as IUser;
  const options = { user };
  /** create cart */
  const { cartData, message } = await cartService.createCart(
    request.body as AddToCartSchema,
    options
  );

  return reply.code(httpStatus.OK).send({
    success: true,
    data: { cartData },
    message,
  });
};

export const updateToCart = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    // const user = request.user as IUser;
    // const options = { user };

    /** create cart */
    const { cartData, message } = await cartService.updateToCart(
      request.body as UpdateToCartSchema
      // options
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: { cartData },
      message,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const removeToCart = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { cartId } = request.params as Partial<UpdateToCartSchema>;

    /** create cart */
    const { message, cartData } = await cartService.removeCart({
      cartId,
    });

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: { cartData },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const getAllCart = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { ...options } = request.query as object;
    const user = request.user as IUser;

    // Get all cart data
    const [cartData] = await cartService.getAllCart(
      {
        user: user._id,
        status: PAYMENTSTATUS.PENDING,
      },
      options
    );

    const totalQty = new Array(cartData?.results)?.reduce(
      (acc: number, c: ICart): number => {
        return acc + c?.quantity;
      },
      0
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: {
        items: cartData,
        totalQty,
      },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
