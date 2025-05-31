const mongoose = require('mongoose');
const { INVENTORY_TYPE } = require('../../helpers/constant.helper');

const inventoryLogSchema = new mongoose.Schema(
  {
    inventory: { type: mongoose.Types.ObjectId, ref: 'Inventory' },
    type: { type: String, enum: Object.values(INVENTORY_TYPE) },
    quantity: Number,
    reference: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Inventory_Log', inventoryLogSchema);
