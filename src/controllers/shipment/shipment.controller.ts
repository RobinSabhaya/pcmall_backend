import httpStatus from 'http-status';
import * as shippingService from '@/services/shipping/shipping.service';
import ApiError from '../../utils/ApiError';
import { SHIPMENT_TYPE, USER_ROLE } from '../../helpers/constant.helper';
import { generateAddressForShipping } from '../../helpers/function.helper';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IUser } from '@/models/user';
import {
  CreateAndUpdateShippingSchema,
  GenerateBuyLabelSchema,
  TrackSchema,
} from '@/validations/shipping.validation';

// Create a shipment, buy label, and save to DB
export const createShipping = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as IUser;
    const options = { user };

    const { shipment, shippoShipment } = await shippingService.createAndUpdateShipping(
      request.body as CreateAndUpdateShippingSchema,
      options,
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: {
        shipment,
        rates: shippoShipment?.rates,
      },
      message: 'Shipping created successfully!',
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

/** Buy label */
export const generateBuyLabel = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { label, shipment } = await shippingService.generateBuyLabel(
      request.body as GenerateBuyLabelSchema,
    );

    return reply.code(httpStatus.OK).send({
      success: true,
      data: {
        shipment,
        label,
      },
      message: 'Label generated successfully',
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};

// Manual tracking
export const track = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as IUser;
    const options = { user };
    const { tracking } = await shippingService.track(request.body as TrackSchema, options);

    return reply.status(httpStatus.OK).send({
      success: true,
      data: tracking,
      message: 'Shipping update successfully!',
    });
  } catch (error) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
};
