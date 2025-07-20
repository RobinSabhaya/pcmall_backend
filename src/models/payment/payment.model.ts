import { PAYMENT_STATUS, USER_CURRENCY, PAYMENT_PROVIDERS } from '../../helpers/constant.helper';
import { config } from '../../config/config'
import { Document, model, Schema } from 'mongoose';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IPayment extends Document,IBaseDocumentModel {
  orderId: Schema.Types.ObjectId;
  provider: string;
  sessionId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(PAYMENT_PROVIDERS),
      required: true,
      default: config.paymentGateway.paymentProvider,
    },
    sessionId: { type: String },
    transactionId: { type: String },
    amount: { type: Number },
    currency: { type: String, default: USER_CURRENCY.INR },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Payment = model<IPayment>('Payment', PaymentSchema);
