import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

import { INVENTORYTYPE } from '../../helpers/constant.helper';

export interface IInventoryLog extends Document, IBaseDocumentModel {
  inventory: Schema.Types.ObjectId;
  type: string;
  quantity: number;
  reference: string;
}

export const inventoryLogSchema = new Schema<IInventoryLog>(
  {
    inventory: { type: Schema.Types.ObjectId, ref: 'Inventory' },
    type: { type: String, enum: Object.values(INVENTORYTYPE) },
    quantity: { type: Number, default: 1 },
    reference: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const inventoryLog = model<IInventoryLog>(
  'Inventory_Log',
  inventoryLogSchema
);
