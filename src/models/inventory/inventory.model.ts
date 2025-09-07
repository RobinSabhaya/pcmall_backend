import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IInventory extends Document, IBaseDocumentModel {
  sku: Schema.Types.ObjectId;
  warehouse: Schema.Types.ObjectId;
  stock: number;
  reserved: number;
  inbound: number;
  outbound: number;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export const inventorySchema = new Schema(
  {
    sku: { type: Schema.Types.ObjectId, ref: 'Product_Sku' },
    warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    stock: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    inbound: { type: Number, default: 0 },
    outbound: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const inventory = model<IInventory>(
  'Product_Inventory',
  inventorySchema
);
