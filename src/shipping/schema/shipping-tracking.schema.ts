import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';

export type ShippingTrackingDocument = HydratedDocument<ShippingTracking>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.SHIPPING_TRACKING,
})
export class ShippingTracking extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MONGOOSE_MODELS.SHIPMENT,
  })
  shipping: Types.ObjectId;
  @Prop({ type: String, trim: true })
  status: string;

  @Prop({ type: Date, trim: true })
  statusDate: Date;
}

export const ShippingTrackingSchema =
  SchemaFactory.createForClass(ShippingTracking);
