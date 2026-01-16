import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { ProductSku } from '../../product-sku/schema/product-sku.schema';
import { User } from '../../user/schema/user.schema';
import { Warehouse } from '../../warehouse/schema/warehouse.schema';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.INVENTORY,
})
export class Inventory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ProductSku.name })
  sku: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Warehouse.name })
  warehouse: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  stock: number;

  @Prop({ type: Number, default: 0 })
  reserved: number;

  @Prop({ type: Number, default: 0 })
  inbound: number;

  @Prop({ type: Number, default: 0 })
  outbound: number;

  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
