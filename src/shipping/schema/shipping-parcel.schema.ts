import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { DistanceUnitType, MassUnitType } from '../enums/shipping.enum';

export type ShippingParcelDocument = HydratedDocument<ShippingParcel>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.SHIPPING_PARCEL,
})
export class ShippingParcel extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MONGOOSE_MODELS.SHIPMENT,
  })
  shipping: Types.ObjectId;

  @Prop({ type: Number })
  length: number;

  @Prop({ type: Number })
  width: number;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: Number })
  weight: number;

  @Prop({
    type: String,
    trim: true,
    enum: Object.values(DistanceUnitType),
    default: DistanceUnitType.In,
  })
  distanceUnit: DistanceUnitType;

  @Prop({
    type: String,
    trim: true,
    enum: Object.values(MassUnitType),
    default: MassUnitType.Lb,
  })
  massUnit: MassUnitType;
}

export const ShippingParcelSchema =
  SchemaFactory.createForClass(ShippingParcel);
