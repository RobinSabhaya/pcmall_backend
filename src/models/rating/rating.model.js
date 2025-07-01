const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    rating: {
      type: Number,
      default: null,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ip: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    images: {
      type: Array,
    },
  },
  {
    versionKey:false,
    timestamps: true,
  }
);

const ratingModel = mongoose.model("Rating", ratingSchema);
module.exports = ratingModel;
