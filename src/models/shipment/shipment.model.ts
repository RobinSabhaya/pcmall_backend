import { SHIPPING_STATUS, SHIPMENT_TYPE, SHIPPING_CARRIERS } from '../../helpers/constant.helper';
import {
  config
} from '../../config/config';
import { Document, model, Schema } from 'mongoose';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IShippingTracking extends Document {
  status: string;
  statusDetails: string;
  statusDate: Date
}

export interface IAddress extends Document {
  name: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}
export interface IShippingParcel extends Document {
  length: number
  width: number;
  height: number;
  distanceUnit: string;
  weight: number;
  massUnit: string;
}
export interface IShippingRate extends Document {
  provider: string;
  serviceLevelName: string;
  amount: string;
  currency: string;
  estimatedDays: string;
  objectId: string;
}
export interface IShippingLabel extends Document {
  labelUrl: string;
  labelType: string,
  trackingNumber: string,
  carrier: string,
  transactionId: string,
}
export interface IShipment extends Document,IBaseDocumentModel {
  shippoShipmentId: string;
  status: string;
  fromAddress: IAddress;
  toAddress: IAddress;
  parcel: IShippingParcel;
  rates: IShippingRate[];
  selectedRate: IShippingRate;
  label: IShippingLabel;
  trackingStatus: IShippingTracking;
  trackingHistory: IShippingTracking[];
  metadata: {
    orderId: string;
    userId: string;
    customTags: Array<string>;
  },
  isReturn: boolean;
  shipmentType: string;
  shippingCarrier: string;
}


const trackingStatusSchema = new Schema<IShippingTracking>(
  {
    status: String,
    statusDetails: String,
    statusDate: Date,
  },
  { _id: false }
);

const addressSchema = new Schema<IAddress>(
  {
    name: String,
    street1: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
    email: String,
  },
  { _id: false }
);

const parcelSchema = new Schema<IShippingParcel>(
  {
    length: Number,
    width: Number,
    height: Number,
    distanceUnit: { type: String, default: 'in' },
    weight: Number,
    massUnit: { type: String, default: 'lb' },
  },
  { _id: false }
);

const rateSchema = new Schema<IShippingRate>(
  {
    provider: String,
    serviceLevelName: String,
    amount: String,
    currency: String,
    estimatedDays: Number,
    objectId: String,
  },
  { _id: false }
);

const labelSchema = new Schema<IShippingLabel>(
  {
    labelUrl: String,
    labelType: String,
    trackingNumber: String,
    carrier: String,
    transactionId: String,
  },
  { _id: false }
);

const shipmentSchema = new Schema<IShipment>(
  {
    shippoShipmentId: { type: String, unique: true, index: true },
    status: { type: String, default: SHIPPING_STATUS.PENDING, index: true },
    fromAddress: addressSchema,
    toAddress: addressSchema,
    parcel: parcelSchema,
    rates: [rateSchema],
    selectedRate: rateSchema,
    label: labelSchema,
    trackingStatus: trackingStatusSchema,
    trackingHistory: [trackingStatusSchema],
    metadata: {
      orderId: String,
      userId: String,
      customTags: [String],
    },
    isReturn: { type: Boolean, default: false },
    shipmentType: {
      type: String,
      enum: Object.values(SHIPMENT_TYPE),
      default: SHIPMENT_TYPE.OUTGOING,
    },
    shippingCarrier: {
      type: String,
      enum: Object.values(SHIPPING_CARRIERS),
      default: config.shipping.shippingCarrier,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Optional TTL (e.g., auto-delete after 60 days if unneeded)
// shipmentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5184000 });

export const Shipment = model<IShipment>('Shipment', shipmentSchema);
