const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    sku: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_Sku' },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    stock: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    inbound: { type: Number, default: 0 },
    outbound: { type: Number, default: 0 },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Product_Inventory', inventorySchema);
