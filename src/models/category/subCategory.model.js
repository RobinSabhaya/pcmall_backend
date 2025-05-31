const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    subCategoryName: {
      type: String,
      required: true,
    },
    tags: [String],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

const subCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = subCategoryModel;
