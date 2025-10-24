import { FilterQuery, UpdateQuery } from 'mongoose';

import {
  findOneAndUpdateDoc,
  paginationQuery,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IOrder, order } from '@/models/orders';

import { toDeepObject } from '../../utils/custom.util';
import { GetOrderListSchema } from '../../validations/order.validation';

/**
 * Get order list
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<[Order]>}
 */
export const getOrderList = async (
  filter: FilterQuery<IOrder>,
  options?: GetOrderListSchema
): Promise<IOrder[]> => {
  const pagination = paginationQuery(options!);

  const orderData = await order.aggregate([
    {
      $match: {
        ...filter,
        ...(options?.status != null && { status: options.status }),
      },
    },
    {
      $unwind: {
        path: '$items',
      },
    },
    {
      $lookup: {
        from: 'product_variants',
        localField: 'items.variant',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'product_skus',
              localField: '_id',
              foreignField: 'variant',
              as: 'product_skus',
            },
          },
          {
            $unwind: {
              path: '$product_skus',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        as: 'product_variants',
      },
    },
    {
      $addFields: {
        product_variants: {
          $mergeObjects: [
            {
              quantity: '$items.quantity',
              unitPrice: '$items.unitPrice',
              totalPrice: '$items.totalPrice',
            },
            {
              $reduce: {
                input: '$product_variants',
                initialValue: {},
                in: { $mergeObjects: ['$$value', '$$this'] },
              },
            },
          ],
        },
      },
    },
    {
      $addFields: {
        items: {
          $arrayElemAt: [['$product_variants'], 0],
        },
      },
    },
    {
      $unset: 'product_variants',
    },
    {
      $group: {
        _id: '$_id',
        items: {
          $push: '$items',
        },
        shippingCost: {
          $first: '$shippingCost',
        },
        shippingAddress: {
          $first: '$shippingAddress',
        },
        tax: {
          $first: '$tax',
        },
        totalAmount: {
          $first: '$totalAmount',
        },
        user: {
          $first: '$user',
        },
        subtotal: {
          $first: '$subtotal',
        },
        createdAt: {
          $first: '$createdAt',
        },
        updatedAt: {
          $first: '$updatedAt',
        },
        status: {
          $first: '$status',
        },
      },
    },
    ...pagination,
  ]);

  return toDeepObject(orderData) as IOrder[];
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
