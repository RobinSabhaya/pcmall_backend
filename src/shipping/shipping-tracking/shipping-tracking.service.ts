import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';

import {
  findOneAndUpdateDoc,
  findOneDoc,
} from '../../common/utils/mongoose.utils';
import { ShippingTracking } from '../schema/shipping-tracking.schema';

@Injectable()
export class ShippingTrackingService {
  constructor(
    @InjectModel(ShippingTracking.name)
    private readonly shippingTrackingModel: Model<ShippingTracking>,
  ) {}

  async createShippingTracking(
    filter: QueryFilter<ShippingTracking>,
    payload: UpdateQuery<ShippingTracking>,
    options: QueryOptions = {},
  ): Promise<ShippingTracking | null> {
    return findOneAndUpdateDoc(
      this.shippingTrackingModel,
      filter,
      payload,
      options,
    );
  }

  async findOne(
    filter: QueryFilter<ShippingTracking>,
  ): Promise<ShippingTracking | null> {
    return findOneDoc(this.shippingTrackingModel, filter);
  }
}
