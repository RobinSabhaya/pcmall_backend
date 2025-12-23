import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { ProductSkuStatus } from '../../common/enums/constants.enum';
import { Product } from '../../product/schema/product.schema';
import { ProductVariant } from '../../product-variant/schema/product-variant.schema';

export type ProductSkuDocument = HydratedDocument<ProductSku>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: MONGOOSE_MODELS.PRODUCT_SKU,
})
export class ProductSku extends Document {
  // TODO: define ref of seller while seller module
  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: MONGOOSE_MODELS.SELLER,
    required: true,
  })
  seller: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: ProductVariant.name,
    required: true,
  })
  variant: Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: Product.name, required: true })
  product: Types.ObjectId;

  @Prop({ type: String, trim: true, required: true })
  skuCode: string;

  @Prop({ type: String, trim: true })
  barcode: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, default: 0 })
  tax: number;

  @Prop({
    type: String,
    enum: Object.values(ProductSkuStatus),
    default: ProductSkuStatus.ACTIVE,
  })
  status: ProductSkuStatus;

  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  updatedBy: Types.ObjectId;
}

export const ProductSkuSchema = SchemaFactory.createForClass(ProductSku);
