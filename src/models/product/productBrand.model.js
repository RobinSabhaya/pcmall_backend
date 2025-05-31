const mongoose = require('mongoose');
const { ACCOUNT_STATUS } = require('../../helpers/constant.helper');

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },

    description: { type: String },
    mission: { type: String },
    vision: { type: String },

    logo: { type: String },
    bannerImage: { type: String },

    website: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },

    headquarters: { type: mongoose.Types.ObjectId, ref: 'Address' },

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
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Product_Brand', BrandSchema);
