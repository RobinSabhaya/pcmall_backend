const mongoose = require('mongoose');
const { USER_GENDER, USER_LANGUAGE, USER_TIMEZONES } = require('../../helpers/constant.helper');

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
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
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('User_Profile', userProfileSchema);
