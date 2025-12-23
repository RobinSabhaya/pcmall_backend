import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { Address } from '../../address/schema/address.schema';
import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { PaymentStatus } from '../../common/enums/constants.enum';
import { Payment } from '../../payment/schema/payment.schema';
import { ProductVariant } from '../../product-variant/schema/product-variant.schema';
import { User } from '../../user/schema/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  versionKey: false,
})
export class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductVariant.name,
    required: true,
  })
  variant: Types.ObjectId | ProductVariant;

  @Prop({ type: Number, required: true, default: 1 })
  quantity: number;

  @Prop({ type: Number, required: true })
  unitPrice: number;

  @Prop({ type: Number, required: true })
  totalPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.ORDER,
})
export class Order extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId | User;

  @Prop({
    type: OrderItemSchema,
  })
  items: [typeof OrderItemSchema];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Address.name,
    required: true,
  })
  shippingAddress: Types.ObjectId | Address;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Payment.name })
  paymentId: Types.ObjectId | Payment;

  @Prop({ type: Number })
  subtotal: number;

  @Prop({ type: Number })
  shippingCost: number;

  @Prop({ type: Number })
  tax: number;

  @Prop({ type: Number })
  totalAmount: number;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  // TODO: need to set ref dynamic while implement Shipment module
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
  })
  shipping: Types.ObjectId;

  @Prop({
    type: Object,
  })
  metadata: object;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
