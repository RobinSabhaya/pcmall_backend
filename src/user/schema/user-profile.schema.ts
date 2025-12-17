import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { UserGender, UserLanguage, UserTimeZones } from '../enums/user-enum';

import { User } from './user.schema';

export type UserProfileDocument = HydratedDocument<UserProfile>;

@Schema({ timestamps: true, versionKey: false })
export class UserProfile {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | User;

  @Prop({ trim: true })
  first_name: string;

  @Prop({ trim: true })
  last_name: string;

  @Prop()
  dob: Date;

  @Prop({
    type: String,
    enum: Object.values(UserGender),
  })
  gender: string;

  @Prop({ type: String, default: null })
  profile_picture: string | null;

  @Prop({
    type: String,
    enum: Object.values(UserLanguage),
    default: UserLanguage.ENGLISH,
  })
  language: string;

  @Prop({
    type: String,
    default: UserTimeZones.UTC,
  })
  timezone: string;

  @Prop({ type: Object })
  metadata: Record<string, unknown>;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
