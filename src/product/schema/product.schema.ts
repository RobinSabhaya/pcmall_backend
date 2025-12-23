import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, Document } from 'mongoose';

import { Category } from '../../category/schema/category.schema';
import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { ConfirmationType } from '../../common/enums/constants.enum';
import { ProductBrand } from '../../product-brand/schema/product-brand.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: MONGOOSE_MODELS.PRODUCT,
})
export class Product extends Document {
  @Prop({ type: String, trim: true })
  title: string;

  @Prop({ type: String, trim: true })
  description: string;

  @Prop({ type: String, trim: true })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductBrand.name,
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

  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: Category.name,
  })
  category: Types.ObjectId | Category;

  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: MONGOOSE_MODELS.USER })
  updatedBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
