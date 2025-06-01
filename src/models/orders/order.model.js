const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../../helpers/constant.helper');

const OrderItemSchema = new mongoose.Schema({
  productSku: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product_Sku',
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
    shipping: {
      type: mongoose.Types.ObjectId,
      ref: 'Shipment',
    },
    metadata: { type: Object },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Order', OrderSchema);
