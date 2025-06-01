const mongoose = require('mongoose');
const { PAYMENT_STATUS, USER_CURRENCY, PAYMENT_PROVIDERS } = require('../../helpers/constant.helper');
const {
  paymentGateway: { paymentProvider },
} = require('../../config/config');

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(PAYMENT_PROVIDERS),
      required: true,
      default: paymentProvider,
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
    versionKey: false,
  }
);

module.exports = mongoose.model('Payment', PaymentSchema);
