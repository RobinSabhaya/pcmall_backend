import { IBaseDocumentModel } from '@/types/mongoose.types';
import { model, Schema, Document } from 'mongoose';

export interface IPermission extends Document, IBaseDocumentModel {
  module: string;
  permission: string;
  slug: string;
  is_active: boolean;
}

const permissionSchema = new Schema<IPermission>(
  {
    module: {
      type: String,
      required: true,
    },
    permission: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Permission = model<IPermission>('Permission', permissionSchema);
