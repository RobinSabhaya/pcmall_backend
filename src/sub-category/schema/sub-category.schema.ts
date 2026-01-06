import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.SUB_CATEGORY,
})
export class SubCategory {
  @Prop({
    type: String,
    required: true,
  })
  subCategoryName: string;

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

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
