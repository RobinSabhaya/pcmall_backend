import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

import { PAYMENTSTATUS } from '../../helpers/constant.helper';

export interface IOrderItem extends Document, IBaseDocumentModel {
  variant: Schema.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrder extends Document, IBaseDocumentModel {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: Schema.Types.ObjectId;
  paymentId: Schema.Types.ObjectId;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: string;
  shipping: Schema.Types.ObjectId;
  metadata: object;
}

export const orderItemSchema = new Schema<IOrderItem>({
  variant: {
    type: Schema.Types.ObjectId,
    ref: 'Product_Variant',
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

export const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    subtotal: { type: Number },
    shippingCost: { type: Number },
    tax: { type: Number },
    totalAmount: { type: Number },
    status: {
      type: String,
      enum: Object.values(PAYMENTSTATUS),
      default: PAYMENTSTATUS.PENDING,
    },
    shipping: {
      type: Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    metadata: { type: Object },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const order = model<IOrder>('Order', orderSchema);
