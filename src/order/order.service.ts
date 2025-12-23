import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';

import { findOneAndUpdateDoc } from '../common/utils/mongoose.utils';

import { Order } from './schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async findOneAndUpdate(
    filter: QueryFilter<Order>,
    payload: UpdateQuery<Order>,
    options: QueryOptions = {},
  ): Promise<Order | null> {
    return findOneAndUpdateDoc(this.orderModel, filter, payload, options);
  }
}
