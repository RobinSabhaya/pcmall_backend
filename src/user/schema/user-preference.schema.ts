import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { UserCurrency } from '../enums/user-enum';

import { User } from './user.schema';

export type UserPreferenceDocument = HydratedDocument<UserPreference>;

@Schema({ timestamps: true, versionKey: false })
export class UserPreference {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: User;

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
