import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { AccountStatus, AuthProvider, UserRole } from '../enums/user-enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    unique: true,
    sparse: true,
  })
  phone_number: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_verified: boolean;

  @Prop({
    type: String,
    enum: Object.values(AccountStatus),
    default: AccountStatus.ACTIVE,
  })
  account_status: string;

  @Prop({
    type: [String],
    enum: Object.values(UserRole),
    default: [UserRole.BUYER],
  })
  roles: string[];

  @Prop({
    type: String,
    enum: Object.values(AuthProvider),
    default: AuthProvider.EMAIL,
  })
  auth_provider: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  is_active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
