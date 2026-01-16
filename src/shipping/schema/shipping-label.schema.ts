import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';

export type ShippingLabelDocument = HydratedDocument<ShippingLabel>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.SHIPPING_LABEL,
})
export class ShippingLabel extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MONGOOSE_MODELS.SHIPMENT,
  })
  shipping: Types.ObjectId;

  @Prop({ type: String, trim: true })
  labelUrl: string;

  @Prop({ type: String, trim: true })
  labelType: string;

  @Prop({ type: String, trim: true })
  trackingNumber: string;

  @Prop({ type: String, trim: true })
  carrier: string;

  @Prop({ type: String, trim: true })
  transactionId: string;
}

export const ShippingLabelSchema = SchemaFactory.createForClass(ShippingLabel);
