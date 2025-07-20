import * as cartService from '@/services/cart/cart.service';
import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import { PAYMENT_STATUS } from '../../helpers/constant.helper';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AddToCartSchema, UpdateToCartSchema } from '@/validations/cart.validation';
import { ICart } from '@/models/cart';
import { IUser } from '@/models/user';
import '@/models/product/productVariant.model'

export const addToCart = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user as IUser
  const options = {user}
  /** create cart */
  const cartData = await cartService.createCart(request.body as AddToCartSchema,options);

  return reply.code(httpStatus.OK).send({
    success: true,
    data: cartData,
    message: 'Cart added successfully',
  });
};

export const updateToCart = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
   const user = request.user as IUser
  const options = {user}

   /** create cart */
  const cartData = await cartService.updateToCart(request.body as UpdateToCartSchema,options);

    return reply.code(httpStatus.OK).send({
      success: true,
      data: cartData,
      message: 'Cart updated successfully',
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

export const removeToCart = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { cartId } = request.params as Partial<UpdateToCartSchema>;
    
    /** create cart */
    await cartService.removeCart({
      _id: cartId,
    });

    return reply.code(httpStatus.OK).send({
      success: true,
      message: 'Cart removed successfully',
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

export const getAllCart = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { ...options } = request.query as object;
    const user = request.user as IUser;

    // Get all cart data
    const cartData = await cartService.getAllCart(
      {
        user: user._id,
        status: PAYMENT_STATUS.PENDING,
      },
      options
    );

    const totalQty = cartData[0]?.results?.reduce((acc: number, c: ICart): number => {
      return acc + c?.quantity;
    }, 0);

    const totalPrice = cartData[0]?.results?.reduce((acc: number, c: ICart): number => {
      return acc + c?.product_variants?.product_skus?.price * c?.quantity;
    }, 0);

    return reply.code(httpStatus.OK).send({
      success: true,
      data: {
        items: cartData[0] || [],
        totalQty,
        totalPrice,
      },
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};