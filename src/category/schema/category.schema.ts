import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { SubCategory } from '../../sub-category/schema/sub-category.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.CATEGORY,
})
export class Category {
  @Prop({
    type: String,
    required: true,
  })
  categoryName: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: SubCategory.name,
      },
    ],
  })
  subCategory: [Types.ObjectId];

  @Prop({
    type: [String],
  })
  tags: string[];

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
