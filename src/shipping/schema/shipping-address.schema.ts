import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';

export type ShippingAddressDocument = HydratedDocument<ShippingAddress>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.SHIPPING_ADDRESS,
})
export class ShippingAddress extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MONGOOSE_MODELS.SHIPMENT,
  })
  shipping: Types.ObjectId;

  @Prop({ type: String, trim: true })
  line1: string;

  @Prop({ type: String, trim: true, default: null })
  line2: String | null;

  @Prop({ type: String, trim: true })
  city: string;

  @Prop({ type: String, trim: true })
  state: string;

  @Prop({ type: String, trim: true })
  zip: string;

  @Prop({ type: String, trim: true })
  country: string;

  @Prop({ type: String, trim: true })
  phone: string;

  @Prop({ type: String, trim: true })
  email: string;
}

export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);
