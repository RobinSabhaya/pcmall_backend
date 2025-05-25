const mongoose = require('mongoose');
const { USER_CURRENCY } = require('../../helpers/constant.helper');

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
  }
);

module.exports = mongoose.model('User_Preference', userPreferenceSchema);
