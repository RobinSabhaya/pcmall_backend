import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { config } from '@/config/config';
import { handlePayment } from '@/services/payment/paymentStrategy';
import ApiError from '@/utils/apiErrorHandler';
import { CreatePaymentRefundSchema } from '@/validations/payment.validation';

const {
  paymentGateway: { paymentProvider },
} = config;

export const createPaymentRefund = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { paymentData, message } = await handlePayment(
      paymentProvider
    ).createPaymentRefund(request.body as CreatePaymentRefundSchema);

    return reply.code(httpStatus.OK).send({
      success: true,
      data: { paymentData },
      message,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
