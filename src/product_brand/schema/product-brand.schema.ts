import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Address } from '../../address/schema/address.schema';
import { AccountStatus } from '../../user/enums/user-enum';

export type ProductBrandDocument = HydratedDocument<ProductBrand>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class ProductBrand {
  @Prop({ type: String, required: true, trim: true })
  name: string;
  @Prop({ type: String, required: true, trim: true })
  slug: string;
  @Prop({ type: String, trim: true })
  description: string;
  @Prop({ type: String, trim: true })
  mission: string;
  @Prop({ type: String, trim: true })
  vision: string;
  @Prop({ type: String, trim: true })
  logo: string;
  @Prop({ type: String, trim: true })
  bannerImage: string;
  @Prop({ type: String, trim: true })
  website: string;
  @Prop({ type: String, trim: true })
  contactEmail: string;
  @Prop({ type: String, trim: true })
  contactPhone: string;

  @Prop({ type: Types.ObjectId, ref: 'Address' })
  headquarters: Types.ObjectId | Address;

  @Prop({ type: Number })
  foundedYear: number;

  @Prop({ type: String, trim: true })
  founder: string;
  @Prop({ type: String, trim: true })
  ceo: string;

  @Prop({ type: String, trim: true })
  seoMetaTitle: string;
  @Prop({ type: String, trim: true })
  seoMetaDescription: string;

  @Prop({
    type: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
  })
  socialLinks: Record<string, string>;

  // Trust & verification
  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: [String] })
  certifications: string[]; // ISO, GMP, etc.

  // Status & moderation
  @Prop({
    type: String,
    enum: Object.values(AccountStatus),
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  // Ratings & Analytics
  @Prop({ type: Number, default: 0 })
  totalRating: number;
  @Prop({ type: Number, default: 0 })
  ratingCount: number;
  @Prop({ type: Number, default: 0 })
  viewCount: number;

  // Audit & control

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const ProductBrandSchema = SchemaFactory.createForClass(ProductBrand);
