import { PAYMENT_STATUS, USER_CURRENCY, PAYMENT_PROVIDERS } from '../../helpers/constant.helper';
import { config } from '../../config/config';
import { Document, model, Schema } from 'mongoose';
import { IBaseDocumentModel } from '@/types/mongoose.types';

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

const PaymentRefundSchema = new Schema<IPaymentRefund>(
  {
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    refundId: { type: String },
    chargeId: { type: String },
    balance_transaction: {type : String},
    amount: { type: Number },
    currency: { type: String, default: USER_CURRENCY.INR },
    reason: { type: String, default : null},
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const PaymentRefund = model<IPaymentRefund>('Payment_Refund', PaymentRefundSchema);
