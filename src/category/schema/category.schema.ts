import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';

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

  // TODO: add ref of sub category while implement Sub category module
  // @Prop({
  //   type: [
  //     {
  //       type: mongoose.Schema.ObjectId,
  //       ref: MONGOOSE_MODELS.SUB_CATEGORY,
  //     },
  //   ],
  // })
  // subCategory: [Types.ObjectId];

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
