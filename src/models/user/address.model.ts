import { Document, model, Schema } from 'mongoose';

import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IAddress extends Document, IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    // geo_location: {
    //   type: {
    //     type: String,
    //     enum: ['Point'],
    //     default: 'Point',
    //   },
    //   coordinates: {
    //     type: [Number], // [longitude, latitude]
    //   },
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// addressSchema.index({ geo_location: '2dsphere' });

export const address = model<IAddress>('Address', addressSchema);
