import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';
import {
  findOneAndUpdateDoc,
  findOneDoc,
  paginationQuery,
} from '../common/utils/mongoose.utils';

import { GetAllOrdersDto } from './dto/order.dto';
import { IGetAllOrders } from './order.interface';
import { Order } from './schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async getAllOrders(
    filter: GetAllOrdersDto,
    options: IOption,
  ): Promise<IGetAllOrders> {
    const { page, limit, status } = filter;
    const pagination = paginationQuery({
      ...filter,
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
    });
    const { user } = options;

    return this.orderModel.aggregate([
      {
        $match: {
          ...filter,
          user: user._id,
          ...(status != null && { status }),
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
  }

  async findOneAndUpdate(
    filter: QueryFilter<Order>,
    payload: UpdateQuery<Order>,
    options: QueryOptions = {},
  ): Promise<Order | null> {
    return findOneAndUpdateDoc(this.orderModel, filter, payload, options);
  }

  async findOne(filter: QueryFilter<Order>): Promise<Order | null> {
    return findOneDoc(this.orderModel, filter);
  }
}
