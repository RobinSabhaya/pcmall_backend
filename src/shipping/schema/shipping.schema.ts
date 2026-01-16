import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import {
  ShipmentType,
  ShippingProvider,
  ShippingStatus,
} from '../enums/shipping.enum';

import { ShippingAddress } from './shipping-address.schema';
import { ShippingLabel } from './shipping-label.schema';
import { ShippingParcel } from './shipping-parcel.schema';
import { ShippingRate } from './shipping-rate.schema';
import { ShippingTracking } from './shipping-tracking.schema';

export type ShippingDocument = HydratedDocument<Shipping>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.SHIPMENT,
})
export class Shipping extends Document {
  @Prop({ type: String, trim: true, unique: true, index: true })
  shippingShipmentId: string;

  @Prop({ type: String, default: ShippingStatus.PENDING })
  status: ShippingStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ShippingAddress.name,
  })
  fromAddress: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ShippingAddress.name,
  })
  toAddress: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ShippingParcel.name })
  parcel: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  rates: Record<string, unknown>[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ShippingRate.name })
  selectedRate: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ShippingLabel.name })
  label: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ShippingTracking.name })
  trackingStatus: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ShippingTracking.name })
  trackingHistory: [Types.ObjectId];

  @Prop({
    type: Object,
  })
  metadata: {
    orderId: string;
    userId: string;
    customTags: string[];
  };

  @Prop({ type: Boolean, default: false })
  isReturn: boolean;

  @Prop({
    type: String,
    enum: Object.values(ShipmentType),
    default: ShipmentType.OUTGOING,
  })
  shipmentType: ShipmentType;

  @Prop({
    type: String,
    enum: Object.values(ShippingProvider),
  })
  shippingCarrier: ShippingProvider;
}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);
