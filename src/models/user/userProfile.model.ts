import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

import {
  USERGENDER,
  USERLANGUAGE,
  USERTIMEZONES,
} from '../../helpers/constant.helper';

export interface IUserProfile extends Document, IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  first_name: string;
  last_name: string;
  dob: Date;
  gender: string;
  profile_picture: string | null;
  language: string;
  timezone: string;
  metadata: Schema.Types.Mixed;
}

export const userProfileSchema = new Schema<IUserProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    first_name: {
      type: String,
      trim: true,
    },
    last_name: { type: String, trim: true },
    dob: { type: Date },
    gender: {
      type: String,
      enum: Object.values(USERGENDER),
    },
    profile_picture: { type: String, default: null },
    language: {
      type: String,
      enum: Object.values(USERLANGUAGE),
      default: USERLANGUAGE.ENGLISH,
    },
    timezone: {
      type: String,
      default: USERTIMEZONES.UTC,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const userProfile = model<IUserProfile>(
  'User_Profile',
  userProfileSchema
);
