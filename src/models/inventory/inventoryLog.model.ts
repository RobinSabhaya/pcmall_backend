import { Document, model, Schema } from "mongoose";
import { INVENTORY_TYPE } from '../../helpers/constant.helper';
import { IBaseDocumentModel } from "@/types/mongoose.types";

export interface IInventoryLog extends Document,IBaseDocumentModel {
  inventory: Schema.Types.ObjectId;
  type: string;
  quantity: number;
  reference: string;
}

const inventoryLogSchema = new Schema<IInventoryLog>(
  {
    inventory: { type: Schema.Types.ObjectId, ref: 'Inventory' },
    type: { type: String, enum: Object.values(INVENTORY_TYPE) },
    quantity: { type: Number, default: 1 },
    reference: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const InventoryLog = model<IInventoryLog>('Inventory_Log', inventoryLogSchema);
