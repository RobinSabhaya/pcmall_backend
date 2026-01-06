import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { Address } from '../../address/schema/address.schema';
import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { Seller } from '../../seller/schema/seller.schema';

export type WarehouseDocument = HydratedDocument<Warehouse>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.WAREHOUSE,
})
export class Warehouse {
  @Prop({
    type: String,
    trim: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Seller.name,
  })
  seller: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Address.name,
  })
  address: Types.ObjectId | Address;

  @Prop({
    type: Boolean,
  })
  isActive: boolean;

  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  updatedBy: Types.ObjectId;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
