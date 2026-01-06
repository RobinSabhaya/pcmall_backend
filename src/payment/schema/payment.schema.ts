import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { PaymentStatus } from '../../common/enums/constants.enum';
import { UserCurrency } from '../../user/enums/user.enum';
import { PaymentProvider } from '../enums/payment.enum';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.PAYMENT,
})
export class Payment extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  })
  orderId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(PaymentProvider),
    required: true,
    default: PaymentProvider.STRIPE,
  })
  provider: string;

  @Prop({ type: String })
  sessionId: string;

  @Prop({ type: String })
  transactionId: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({
    type: String,
    default: UserCurrency.INR,
  })
  currency: string;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
