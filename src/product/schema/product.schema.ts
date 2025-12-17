import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { ConfirmationType } from '../../common/enums/constants.enum';
import { ProductBrand } from '../../product_brand/schema/product-brand.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ type: String, trim: true })
  title: string;

  @Prop({ type: String, trim: true })
  description: string;

  @Prop({ type: String, trim: true })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Product_Brand',
    required: true,
  })
  brand: Types.ObjectId | ProductBrand;

  @Prop({ type: String })
  modelNumber: string;

  @Prop({
    type: [String],
  })
  tags: string[];
  @Prop({
    type: Boolean,
    default: false,
  })
  isPublished: boolean;

  @Prop({
    type: String,
    enum: Object.values(ConfirmationType),
    default: ConfirmationType.PENDING,
  })
  approvalStatus: string;

  // TODO: need to define Category model class
  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
  })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
