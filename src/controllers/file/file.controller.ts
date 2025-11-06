import { FastifyReply, FastifyRequest } from 'fastify';
import { status as httpStatus } from 'http-status';

import { config } from '../../config/config';
import { handleStorage } from '../../services/storage/storageStrategy';
import ApiError from '../../utils/apiErrorHandler';
import { GenerateFileUploadSchema } from '../../validations/file.validation';

const { fileStorageProvider } = config.minIO;

// checkout
export const generateFileUploadURL = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { fileName } = request.body as GenerateFileUploadSchema;

    const url = await handleStorage(
      fileStorageProvider!
    ).generatePresignedPutURL({
      fileName,
    });

    return reply.code(httpStatus.OK).send({
      success: true,
      message: 'File upload URL generated successfully',
      data: {
        url,
      },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
