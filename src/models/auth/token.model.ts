import { Document, model, Schema } from 'mongoose';
import { TOKEN_TYPES } from '../../helpers/constant.helper';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IDeviceInfo {
  device_id: string;
  device_type: string;
  os: {
    name: string;
    version: string;
  };
  browser: {
    name: string;
    version: string;
  };
  brand: string;
  model: string;
  user_agent: string;
}

const deviceInfoSchema = new Schema<IDeviceInfo>(
  {
    device_id: {
      type: String,
    },
    device_type: {
      type: String, // e.g., "Mobile", "Desktop", "Tablet"
      required: true,
    },
    os: {
      name: { type: String }, // e.g., "iOS", "Android", "Windows", "macOS"
      version: { type: String },
    },
    browser: {
      name: { type: String }, // e.g., "Chrome", "Safari", "Firefox"
      version: { type: String },
    },
    brand: { type: String }, // e.g., "Apple", "Samsung"
    model: { type: String }, // e.g., "iPhone 14"
    user_agent: { type: String }, // full UA string
  },
  { _id: false },
);

export interface IToken extends Document, IBaseDocumentModel {
  token: string;
  user: Schema.Types.ObjectId;
  device_info: IDeviceInfo;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    device_info: deviceInfoSchema,
    type: {
      type: String,
      enum: Object.values(TOKEN_TYPES),
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

tokenSchema.index({ user: 1 });

export const Token = model<IToken>('Token', tokenSchema);
