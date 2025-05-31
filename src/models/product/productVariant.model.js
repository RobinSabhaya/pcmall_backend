const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    attributeCombination: { type: Object },
    images: [String],
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Product_Variant', VariantSchema);
