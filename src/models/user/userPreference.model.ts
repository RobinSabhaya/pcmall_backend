import { Document, model, Schema } from 'mongoose';
import { USER_CURRENCY } from '../../helpers/constant.helper';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IUserPreference extends Document, IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  currency: string;
  notification_email: boolean;
  notification_sms: boolean;
  dark_mode: boolean;
  newsletter_opt_in: boolean;
}

const userPreferenceSchema = new Schema<IUserPreference>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    currency: {
      type: String,
      enum: Object.values(USER_CURRENCY),
      default: USER_CURRENCY.INR,
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
  },
);

export const User_Preference = model<IUserPreference>('User_Preference', userPreferenceSchema);
