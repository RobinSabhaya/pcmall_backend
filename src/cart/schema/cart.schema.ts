import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { PaymentStatus } from '../../common/enums/constants.enum';
import { ProductVariant } from '../../product-variant/schema/product-variant.schema';
import { User } from '../../user/schema/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: MONGOOSE_MODELS.CART,
})
export class Cart extends Document {
  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  user: Types.ObjectId | User;

  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: MONGOOSE_MODELS.PRODUCT_VARIANT,
  })
  variant: Types.ObjectId | ProductVariant;

  @Prop({ default: 1 })
  quantity: number;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
