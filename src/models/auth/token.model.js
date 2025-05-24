const mongoose = require('mongoose');
const { toJSON } = require('../plugins');
const { TOKEN_TYPES } = require('../../helpers/constant.helper');

const deviceInfoSchema = new mongoose.Schema(
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
  { _id: false }
);

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
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
  }
);

tokenSchema.index({ user: 1 });

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
