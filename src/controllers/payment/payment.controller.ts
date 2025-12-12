import { FastifyReply, FastifyRequest } from 'fastify';
import { status as httpStatus } from 'http-status';

import { config } from '@/config/config';
import * as paymentService from '@/services/payment/payment.service';
import { handlePayment } from '@/services/payment/paymentStrategy';
import ApiError from '@/utils/apiErrorHandler';
import {
  CreatePaymentRefundSchema,
  GetPaymentDetailsSchema,
} from '@/validations/payment.validation';

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

export const getPaymentDetails = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const { sessionId } = request.query as GetPaymentDetailsSchema;

  const data = await paymentService.getPaymentDetails({
    sessionId,
  });

  return reply.status(httpStatus.OK).send({
    success: true,
    data: {
      paymentDetails: data,
    },
  });
};
