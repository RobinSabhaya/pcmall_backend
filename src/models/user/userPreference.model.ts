import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

import { USERCURRENCY } from '../../helpers/constant.helper';

export interface IUserPreference extends Document, IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  currency: string;
  notification_email: boolean;
  notification_sms: boolean;
  dark_mode: boolean;
  newsletter_opt_in: boolean;
}

export const userPreferenceSchema = new Schema<IUserPreference>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    currency: {
      type: String,
      enum: Object.values(USERCURRENCY),
      default: USERCURRENCY.INR,
    },
    notification_email: {
      type: Boolean,
      default: true,
    },
    notification_sms: {
      type: Boolean,
      default: false,
    },
    dark_mode: {
      type: Boolean,
      default: false,
    },
    newsletter_opt_in: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const userPreference = model<IUserPreference>(
  'User_Preference',
  userPreferenceSchema
);
