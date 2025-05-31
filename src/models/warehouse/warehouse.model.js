const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema(
  {
    name: String,
    seller: { type: mongoose.Types.ObjectId, ref: 'Seller' },
    address: { type: mongoose.Types.ObjectId, ref: 'Address' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Warehouse', WarehouseSchema);
