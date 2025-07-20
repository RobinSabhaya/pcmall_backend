import httpStatus from 'http-status';
import ApiError from '@/utils/ApiError';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as inventoryService from '@/services/inventory/inventory.service';
import { CreateUpdateInventorySchema, DeleteInventorySchema } from '@/validations/inventory.validation';
import { IUser } from '@/models/user';

export const createUpdateInventory = async (request:FastifyRequest, reply:FastifyReply) => {
  const user = request.user as IUser
  const options = {user}
  try {
  
    const {message,inventoryData} = await inventoryService.saveInventory(request.body as CreateUpdateInventorySchema, options) 

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: inventoryData,
    });
  } catch (error) {
    if(error instanceof Error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

export const deleteInventory = async (request:FastifyRequest, reply:FastifyReply) => {
  try {

    const { inventoryData,message} = await inventoryService.deleteInventory(request.query as DeleteInventorySchema)

    return reply.code(httpStatus.OK).send({
      success: true,
      message,
      data: inventoryData,
    });
  } catch (error) {
    if(error instanceof Error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

export const getAllInventory = async (request:FastifyRequest, reply:FastifyReply) => {
  try {
    const inventoryData = await inventoryService.getAllInventory({});

    return reply.code(httpStatus.OK).send({
      success: true,
      data: inventoryData,
    });
  } catch (error) {
    if(error instanceof Error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};