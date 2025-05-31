const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
    tags: [String],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;
