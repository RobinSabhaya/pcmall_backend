import { Document, model, Schema } from 'mongoose';
import { CONFIRMATION_TYPE } from '../../helpers/constant.helper';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IProduct extends Document, IBaseDocumentModel {
  title: string;
  description: string;
  slug: string;
  brand: Schema.Types.ObjectId;
  modelNumber: string;
  tags: Array<string>;
  isPublished: boolean;
  approvalStatus: string;
  category: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, trim: true },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Product_Brand',
      required: true,
    },
    modelNumber: { type: String },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: Object.values(CONFIRMATION_TYPE),
      default: CONFIRMATION_TYPE.PENDING,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false },
);

export const Product = model<IProduct>('Product', productSchema);
