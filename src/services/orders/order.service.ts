import { IOrder } from "@/models/orders";
import { FilterQuery, UpdateQuery } from "mongoose";
import {Order} from '../../models/orders';
import { findOneAndUpdateDoc, PaginationOptions, paginationQuery } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from "@/helpers/mongoose.model.helper";
import { IUser } from "@/models/user";

/**
 * Get order list
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Order]>}
 */
export const getOrderList = (filter:FilterQuery<IOrder>, options?:PaginationOptions):Promise<IOrder[]> => {
  console.log("🚀 ~ filter:", filter)
  const pagination = paginationQuery(options!);

  return Order.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    ...pagination,
  ]);
};

/**
 * Update Order
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Order>}
 */
export const updateOrder = (filter:FilterQuery<IOrder>, reqBody:UpdateQuery<IOrder>, options = {}):Promise<IOrder | null> => {
  return findOneAndUpdateDoc(MONGOOSE_MODELS.ORDER,filter, reqBody, options);
};

