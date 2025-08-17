import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import * as warehouseService from '@/services/warehouse/warehouse.service';
import ApiError from '@/utils/apiErrorHandler';
import {
  CreateUpdateWarehouseSchema,
  DeleteWarehouseSchema,
} from '@/validations/warehouse.validation';

export const createUpdateWarehouse = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { message, warehouseData } =
      await warehouseService.createUpdateWarehouse(
        request.body as CreateUpdateWarehouseSchema
      );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: warehouseData,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const deleteWarehouse = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { message, warehouseData } = await warehouseService.deleteWarehouse(
      request.query as DeleteWarehouseSchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: warehouseData,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const getAllWarehouse = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { warehouseData } = await warehouseService.getAllWarehouse({});
    return reply.code(httpStatus.OK).send({
      success: true,
      data: warehouseData,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
