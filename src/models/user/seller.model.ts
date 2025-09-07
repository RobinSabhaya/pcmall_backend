import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface ISeller extends Document, IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  name: string;
  businessEmail: string;
  businessName: string;
  gstNumber: string;
}

export const sellerSchema = new Schema<ISeller>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: { type: String },
    businessEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    businessName: { type: String },
    gstNumber: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const seller = model<ISeller>('Seller', sellerSchema);
