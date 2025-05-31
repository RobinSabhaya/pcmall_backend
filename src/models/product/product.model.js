const mongoose = require('mongoose');
const { CONFIRMATION_TYPE } = require('../../helpers/constant.helper');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, unique: true },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product_Brand',
      required: true,
    },
    modelNumber: { type: String },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    approvalStatus: { type: String, enum: Object.values(CONFIRMATION_TYPE), default: CONFIRMATION_TYPE.PENDING },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
);

const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;
