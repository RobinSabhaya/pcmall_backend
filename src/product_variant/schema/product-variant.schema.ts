import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Product } from '../../product/schema/product.schema';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({ timestamps: true, versionKey: false })
export class ProductVariant {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
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

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
