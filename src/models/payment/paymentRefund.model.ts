import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

import { PAYMENTSTATUS, USERCURRENCY } from '../../helpers/constant.helper';

export interface IPaymentRefund extends Document, IBaseDocumentModel {
  paymentId: Schema.Types.ObjectId;
  refundId: string;
  chargeId: string;
  balance_transaction: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
}

const paymentRefundSchema = new Schema<IPaymentRefund>(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    refundId: { type: String },
    chargeId: { type: String },
    balance_transaction: { type: String },
    amount: { type: Number },
    currency: { type: String, default: USERCURRENCY.INR },
    reason: { type: String, default: null },
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

export const paymentRefund = model<IPaymentRefund>(
  'Payment_Refund',
  paymentRefundSchema
);
