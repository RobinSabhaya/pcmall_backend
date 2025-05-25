const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../../helpers/constant.helper');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    shippingAddress: {
      type: mongoose.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    subtotal: { type: Number },
    shippingCost: { type: Number },
    tax: { type: Number },
    totalAmount: { type: Number },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    shippingProvider: { type: String },
    shippingTracking: { type: Object },
    metadata: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', OrderSchema);
