const mongoose = require('mongoose');
const { PAYMENT_STATUS, USER_CURRENCY } = require('../../helpers/constant.helper');

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    provider: {
      type: String,
      enum: ['stripe', 'paypal', 'razorpay'],
      required: true,
    },
    sessionId: { type: String },
    transactionId: { type: String },
    amount: { type: Number },
    currency: { type: String, default: USER_CURRENCY.INR },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', PaymentSchema);
