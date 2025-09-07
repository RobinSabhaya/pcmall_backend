import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

import { config } from '../../config/config';
import {
  PAYMENTPROVIDERS,
  PAYMENTSTATUS,
  USERCURRENCY,
} from '../../helpers/constant.helper';

export interface IPayment extends Document, IBaseDocumentModel {
  orderId: Schema.Types.ObjectId;
  provider: string;
  sessionId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
}

export const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(PAYMENTPROVIDERS),
      required: true,
      default: config.paymentGateway.paymentProvider,
    },
    sessionId: { type: String },
    transactionId: { type: String },
    amount: { type: Number },
    currency: { type: String, default: USERCURRENCY.INR },
    status: {
      type: String,
      enum: Object.values(PAYMENTSTATUS),
      default: PAYMENTSTATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const payment = model<IPayment>('Payment', paymentSchema);
