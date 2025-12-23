import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { Product } from '../../product/schema/product.schema';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: MONGOOSE_MODELS.PRODUCT_VARIANT,
})
export class ProductVariant extends Document {
  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: MONGOOSE_MODELS.PRODUCT_VARIANT,
  })
  product: Types.ObjectId | Product;

  @Prop({
    type: String,
    trim: true,
    required: true,
  })
  name: string;

  @Prop({
    type: Object,
  })
  attributeCombination: object;

  @Prop({
    type: [String],
    default: [],
  })
  images: string[];

  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  updatedBy: Types.ObjectId;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
