import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error.validation) {
    const formattedErrors = (error?.validation as any[])
      .map((err) => ({
        field: err.instancePath.replace('/', '') || 'body',
        message: err.message,
        expected: err.params?.expected || null,
      }))
      .map((error) => `${error.field}: expected ${error.expected}`)
      .join(',');

    return reply.code(httpStatus.BAD_REQUEST).send({
      success: false,
      details: formattedErrors,
    });
  }
  return reply
    .code(httpStatus.INTERNAL_SERVER_ERROR)
    .send({ success: false, message: error.message });
};
