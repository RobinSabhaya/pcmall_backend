import { IBaseDocumentModel } from '@/types/mongoose.types';
import mongoose, { Document, model, Schema } from 'mongoose';

export interface ICategory extends Document,IBaseDocumentModel {
  categoryName: string;
  subCategory: Schema.Types.ObjectId;
  tags: Array<string>;
  deletedAt: Date | null
}

const categorySchema = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: true,
    },
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
    tags: [String],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', categorySchema);

