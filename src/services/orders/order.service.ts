import { FilterQuery, UpdateQuery } from 'mongoose';

import {
  findOneAndUpdateDoc,
  IPaginationOptions,
  paginationQuery,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IOrder, order } from '@/models/orders';

/**
 * Get order list
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Order]>}
 */
export const getOrderList = async (
  filter: FilterQuery<IOrder>,
  options?: IPaginationOptions
): Promise<IOrder[]> => {
  const pagination = paginationQuery(options!);

  return order.aggregate([
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
export const updateOrder = async (
  filter: FilterQuery<IOrder>,
  reqBody: UpdateQuery<IOrder>,
  options = {}
): Promise<IOrder | null> => {
  return findOneAndUpdateDoc(MONGOOSE_MODELS.ORDER, filter, reqBody, options);
};
