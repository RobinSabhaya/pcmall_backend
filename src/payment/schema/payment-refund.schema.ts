import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { PaymentStatus } from '../../common/enums/constants.enum';
import { UserCurrency } from '../../user/enums/user.enum';

import { Payment } from './payment.schema';

export type PaymentRefundDocument = HydratedDocument<PaymentRefund>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.PAYMENT_REFUND,
})
export class PaymentRefund extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Payment.name,
    required: true,
  })
  paymentId: Types.ObjectId | Payment;

  @Prop({ type: String })
  refundId: string;

  @Prop({ type: String })
  chargeId: string;

  @Prop({ type: String })
  balance_transaction: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String, default: UserCurrency.INR })
  currency: UserCurrency;

  @Prop({ type: String, default: null })
  reason: string | null;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;
}

export const PaymentRefundSchema = SchemaFactory.createForClass(PaymentRefund);
