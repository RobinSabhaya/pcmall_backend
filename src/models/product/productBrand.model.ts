import { Document, model, Schema } from 'mongoose';
import { ACCOUNT_STATUS } from '../../helpers/constant.helper';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IProductBrand extends Document, IBaseDocumentModel {
  name: string;
  slug: string;
  description: string;
  mission: string;
  vision: string;
  logo: string;
  weboste: string;
  bannerImage: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  headquarters: Schema.Types.ObjectId;
  foundedYear: number;
  founder: string;
  ceo: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  socialLinks: {
    facebook: string;
    teitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  isVerified: boolean;
  certifications: Array<string>;
  status: string;
  totalRating: number;
  ratingCount: number;
  viewCount: number;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

const BrandSchema = new Schema<IProductBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },

    description: { type: String },
    mission: { type: String },
    vision: { type: String },

    logo: { type: String },
    bannerImage: { type: String },

    website: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },

    headquarters: { type: Schema.Types.ObjectId, ref: 'Address' },

    foundedYear: { type: Number },
    founder: { type: String },
    ceo: { type: String },

    seoMetaTitle: { type: String },
    seoMetaDescription: { type: String },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },

    // Trust & verification
    isVerified: { type: Boolean, default: false },
    certifications: [String], // ISO, GMP, etc.

    // Status & moderation
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
    },

    // Ratings & Analytics
    totalRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },

    // Audit & control
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false },
);

export const Product_Brand = model<IProductBrand>('Product_Brand', BrandSchema);
