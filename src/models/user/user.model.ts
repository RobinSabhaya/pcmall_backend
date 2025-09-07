import bcrypt from 'bcryptjs';
import { Document, Model, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

import {
  ACCOUNTSTATUS,
  AUTHPROVIDER,
  USERROLE,
} from '../../helpers/constant.helper';

export interface IUser extends Document, IBaseDocumentModel {
  _id: Schema.Types.ObjectId;
  email: string;
  phone_number: string;
  password: string;
  is_verified: boolean;
  account_status: string;
  roles: Array<string>;
  auth_provider: string;
  is_active: boolean;
}

export interface IUserModel extends Model<IUser> {
  isPasswordMatch: (password: string) => Promise<boolean>;
}

export const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    account_status: {
      type: String,
      enum: Object.values(ACCOUNTSTATUS),
      default: ACCOUNTSTATUS.ACTIVE,
    },
    roles: {
      type: [String],
      enum: Object.values(USERROLE),
      default: [USERROLE.BUYER],
    },
    auth_provider: {
      type: String,
      enum: Object.values(AUTHPROVIDER),
      default: AUTHPROVIDER.EMAIL,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (
  password: string
): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
export const user = model<IUser, IUserModel>('User', userSchema);
