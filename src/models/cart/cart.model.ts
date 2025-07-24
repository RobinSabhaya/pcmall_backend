import { Document, model, Schema } from 'mongoose';
import { PAYMENT_STATUS } from '../../helpers/constant.helper';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface ICart extends Document, IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  variant: Schema.Types.ObjectId;
  quantity: number;
  status: string;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: 'Product_Variant',
    },
    quantity: {
      type: Number,
      default: 1,
    },
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

export const Cart = model<ICart>('Cart', cartSchema);
