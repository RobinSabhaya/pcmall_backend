import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { PaymentStatus } from '../../common/enums/constants.enum';
import { ProductVariant } from '../../product_variant/schema/product-variant.schema';
import { User } from '../../user/schema/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Product_Variant' })
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
