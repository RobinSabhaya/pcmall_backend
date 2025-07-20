import { Document, model, Schema } from 'mongoose';
import { USER_GENDER, USER_LANGUAGE, USER_TIMEZONES } from '../../helpers/constant.helper';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IUserProfile extends Document,IBaseDocumentModel { 
  user: Schema.Types.ObjectId;
  first_name: string;
  last_name: string;
  dob: Date;
  gender: string;
  profile_picture: string;
  language: string;
  timezone: string;
  metadata: Schema.Types.Mixed;
}

const userProfileSchema = new Schema<IUserProfile>(
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
      enum: Object.values(USER_GENDER),
    },
    profile_picture: { type: String, default: null },
    language: {
      type: String,
      enum: Object.values(USER_LANGUAGE),
      default: USER_LANGUAGE.ENGLISH,
    },
    timezone: {
      type: String,
      default: USER_TIMEZONES.UTC,
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

export const User_Profile = model<IUserProfile>('User_Profile', userProfileSchema);
