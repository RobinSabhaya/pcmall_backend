import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

import { PAYMENTSTATUS } from '../../helpers/constant.helper';

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
      enum: Object.values(PAYMENTSTATUS),
      default: PAYMENTSTATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const cart = model<ICart>('Cart', cartSchema);
