const mongoose = require('mongoose');

const userAuditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    action: String,
    description: String,
    ip_address: String,
    user_agent: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('User_AuditLog', userAuditLogSchema);
