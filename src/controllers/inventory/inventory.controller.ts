import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { IUser } from '@/models/user';
import * as inventoryService from '@/services/inventory/inventory.service';
import ApiError from '@/utils/apiErrorHandler';
import {
  CreateUpdateInventorySchema,
  DeleteInventorySchema,
} from '@/validations/inventory.validation';

export const createUpdateInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const user = request.user as IUser;
  const options = { user };
  try {
    const { message, inventoryData } = await inventoryService.saveInventory(
      request.body as CreateUpdateInventorySchema,
      options
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: inventoryData,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const deleteInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { inventoryData, message } = await inventoryService.deleteInventory(
      request.query as DeleteInventorySchema
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: inventoryData,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const getAllInventory = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const inventoryData = await inventoryService.getAllInventory({});

    return reply.code(httpStatus.OK).send({
      success: true,
      data: inventoryData,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
