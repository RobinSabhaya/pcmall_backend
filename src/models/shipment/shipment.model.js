const mongoose = require('mongoose');
const { SHIPPING_STATUS, SHIPMENT_TYPE, SHIPPING_CARRIERS } = require('../../helpers/constant.helper');
const {
  shipping: { shippingCarrier },
} = require('../../config/config');

const trackingStatusSchema = new mongoose.Schema(
  {
    status: String,
    statusDetails: String,
    statusDate: Date,
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    name: String,
    street1: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
    email: String,
  },
  { _id: false }
);

const parcelSchema = new mongoose.Schema(
  {
    length: Number,
    width: Number,
    height: Number,
    distanceUnit: { type: String, default: 'in' },
    weight: Number,
    massUnit: { type: String, default: 'lb' },
  },
  { _id: false }
);

const rateSchema = new mongoose.Schema(
  {
    provider: String,
    serviceLevelName: String,
    amount: String,
    currency: String,
    estimatedDays: Number,
    objectId: String,
  },
  { _id: false }
);

const labelSchema = new mongoose.Schema(
  {
    labelUrl: String,
    labelType: String,
    trackingNumber: String,
    carrier: String,
    transactionId: String,
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    shippoShipmentId: { type: String, unique: true, index: true },
    status: { type: String, default: SHIPPING_STATUS.PENDING, index: true },
    fromAddress: addressSchema,
    toAddress: addressSchema,
    parcel: parcelSchema,
    rates: [rateSchema],
    selectedRate: rateSchema,
    label: labelSchema,
    trackingStatus: trackingStatusSchema,
    trackingHistory: [trackingStatusSchema],
    metadata: {
      orderId: String,
      userId: String,
      customTags: [String],
    },
    isReturn: { type: Boolean, default: false },
    shipmentType: {
      type: String,
      enum: Object.values(SHIPMENT_TYPE),
      default: SHIPMENT_TYPE.OUTGOING,
    },
    shippingCarrier: {
      type: String,
      enum: Object.values(SHIPPING_CARRIERS),
      default: shippingCarrier,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Optional TTL (e.g., auto-delete after 60 days if unneeded)
// shipmentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5184000 });

module.exports = mongoose.model('Shipment', shipmentSchema);
