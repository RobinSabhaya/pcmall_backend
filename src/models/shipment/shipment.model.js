const mongoose = require("mongoose");

const trackingStatusSchema = new mongoose.Schema(
  {
    status: String,
    status_details: String,
    status_date: Date,
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
    distance_unit: { type: String, default: "in" },
    weight: Number,
    mass_unit: { type: String, default: "lb" },
  },
  { _id: false }
);

const rateSchema = new mongoose.Schema(
  {
    provider: String,
    servicelevel_name: String,
    amount: String,
    currency: String,
    estimated_days: Number,
    object_id: String,
  },
  { _id: false }
);

const labelSchema = new mongoose.Schema(
  {
    label_url: String,
    label_type: String,
    tracking_number: String,
    carrier: String,
    transaction_id: String,
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    shippo_shipment_id: { type: String, unique: true, index: true },
    status: { type: String, default: "PENDING", index: true },

    from_address: addressSchema,
    to_address: addressSchema,
    parcel: parcelSchema,

    rates: [rateSchema],
    selected_rate: rateSchema,

    label: labelSchema,

    tracking_status: trackingStatusSchema,
    tracking_history: [trackingStatusSchema],

    metadata: {
      order_id: String,
      user_id: String,
      custom_tags: [String],
    },

    is_return: { type: Boolean, default: false },
    shipment_type: {
      type: String,
      enum: ["OUTGOING", "RETURN"],
      default: "OUTGOING",
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Optional TTL (e.g., auto-delete after 60 days if unneeded)
// shipmentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5184000 });

module.exports = mongoose.model("Shipment", shipmentSchema);
