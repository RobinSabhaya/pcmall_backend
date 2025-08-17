import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { IUser } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';
import { GetOrderListSchema } from '@/validations/order.validation';

import * as orderService from '../../services/orders/order.service';

/**
 * Get order list
 */
export const getOrderList = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const user = request.user as IUser;

    const orderData = await orderService.getOrderList(
      {
        user: user._id,
      },
      request.query as GetOrderListSchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: orderData[0],
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
