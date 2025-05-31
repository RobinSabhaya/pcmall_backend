const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    name: { type: String },
    businessEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    businessName: { type: String },
    gstNumber: { type: String },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Seller', SellerSchema);
