import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';

export type ShippingRateDocument = HydratedDocument<ShippingRate>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.SHIPPING_RATE,
})
export class ShippingRate extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MONGOOSE_MODELS.SHIPMENT,
  })
  shipping: Types.ObjectId;

  @Prop({ type: String, trim: true })
  provider: string;

  @Prop({ type: String, trim: true })
  serviceLevelName: string;

  @Prop({ type: String, trim: true })
  amount: string;

  @Prop({ type: String, trim: true })
  currency: string;

  @Prop({ type: Number })
  estimatedDays: number;

  @Prop({ type: String, trim: true })
  objectId: string;
}

export const ShippingRateSchema = SchemaFactory.createForClass(ShippingRate);
