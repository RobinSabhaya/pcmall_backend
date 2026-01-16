import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { InventoryType } from '../inventory.interface';

import { Inventory } from './inventory.schema';

export type InventoryLogDocument = HydratedDocument<InventoryLog>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.INVENTORY_LOG,
})
export class InventoryLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Inventory.name })
  inventory: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(InventoryType) })
  type: InventoryType;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: String, trim: true, default: null })
  reference: string | null;
}

export const InventoryLogSchema = SchemaFactory.createForClass(InventoryLog);
