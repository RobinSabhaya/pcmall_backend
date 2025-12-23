import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { MONGOOSE_MODELS } from '../../common/constants/mongoose-model.constant';
import { UserCurrency } from '../enums/user.enum';

export type UserPreferenceDocument = HydratedDocument<UserPreference>;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: MONGOOSE_MODELS.USER_PREFERENCE,
})
export class UserPreference {
  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: MONGOOSE_MODELS.USER,
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(UserCurrency),
    default: UserCurrency.INR,
  })
  currency: string;

  @Prop({ default: true })
  notification_email: boolean;

  @Prop({ default: false })
  notification_sms: boolean;

  @Prop({ default: false })
  dark_mode: boolean;

  @Prop({ default: true })
  newsletter_opt_in: boolean;
}

export const UserPreferenceSchema =
  SchemaFactory.createForClass(UserPreference);
