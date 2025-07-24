import { IBaseDocumentModel } from '@/types/mongoose.types';
import { Document, model, Schema } from 'mongoose';

export interface IRating extends Document, IBaseDocumentModel {
  product: Schema.Types.ObjectId;
  rating: number;
  user: Schema.Types.ObjectId;
  ip: string;
  message: string;
  images: Array<string>;
}

const ratingSchema = new Schema<IRating>(
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
  },
);

export const Rating = model<IRating>('Rating', ratingSchema);
