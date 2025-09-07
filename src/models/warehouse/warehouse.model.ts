import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IWarehouse extends Document, IBaseDocumentModel {
  name: string;
  seller: Schema.Types.ObjectId;
  address: Schema.Types.ObjectId;
  isActive: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}
export const warehouseSchema = new Schema<IWarehouse>(
  {
    name: String,
    seller: { type: Schema.Types.ObjectId, ref: 'Seller' },
    address: { type: Schema.Types.ObjectId, ref: 'Address' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const warehouse = model<IWarehouse>('Warehouse', warehouseSchema);
