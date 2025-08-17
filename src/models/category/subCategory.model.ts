import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface ISubCategory extends Document, IBaseDocumentModel {
  subCategoryName: string;
  tags: Array<string>;
  deletedAt: Date | null;
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    subCategoryName: {
      type: String,
      required: true,
    },
    tags: [String],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

export const subCategory = model<ISubCategory>(
  'SubCategory',
  subCategorySchema
);
