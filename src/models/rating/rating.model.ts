import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IRating extends Document, IBaseDocumentModel {
  product: Schema.Types.ObjectId;
  rating: number;
  user: Schema.Types.ObjectId;
  ip: string;
  message: string;
  images: Array<string>;
}

export const ratingSchema = new Schema<IRating>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    rating: {
      type: Number,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ip: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    images: [],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const rating = model<IRating>('Rating', ratingSchema);
