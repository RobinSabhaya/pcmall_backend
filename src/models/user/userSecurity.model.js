const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema(
  {
    ip_address: {
      type: String,
    },
    device: { type: String },
    logged_in_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSecuritySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    two_factor_enabled: {
      type: Boolean,
      default: false,
    },
    login_history: {
      type: [loginHistorySchema],
      default: [],
    },
    failed_attempts: {
      type: Number,
      default: 0,
    },
    lockout_time: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('UserSecurity', userSecuritySchema);
