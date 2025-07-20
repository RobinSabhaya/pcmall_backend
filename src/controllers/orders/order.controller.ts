import { FastifyReply, FastifyRequest } from 'fastify';
import * as orderService from '../../services/orders/order.service';
import { IUser } from '@/models/user';
import httpStatus from 'http-status';
import { GetOrderListSchema } from '@/validations/order.validation';
import ApiError from '@/utils/ApiError';
import { Schema } from 'mongoose';

/**
 * Get order list
 */
export const getOrderList = async (request:FastifyRequest, reply:FastifyReply) => {
  try {
    const user = request.user as IUser;

  const orderData = await orderService.getOrderList(
    {
      user : new Schema.Types.ObjectId(String(user._id))
    },
    request.query as GetOrderListSchema
  );

  return reply.code(httpStatus.OK).send({
    success: true,
    data: orderData[0],
  });
  } catch (error) {
    if (error instanceof Error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};