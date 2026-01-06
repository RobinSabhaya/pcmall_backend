import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { User } from '../../user/schema/user.schema';

export type SellerDocument = HydratedDocument<Seller>;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: MONGOOSE_MODELS.SELLER,
})
export class Seller {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: Types.ObjectId | User;

  @Prop({ type: String })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  businessEmail: string;

  @Prop({ type: String, trim: true })
  businessName: string;

  @Prop({ type: String, trim: true })
  gstNumber: string;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
