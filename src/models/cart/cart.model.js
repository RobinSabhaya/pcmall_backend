const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../../helpers/constant.helper');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product_Variant',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
