const mongoose = require('mongoose');
const { PRODUCT_SKU_STATUS } = require('../../helpers/constant.helper');

const SKUSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Types.ObjectId, ref: 'Seller' },
    variant: { type: mongoose.Types.ObjectId, ref: 'Variant' },
    product: { type: mongoose.Types.ObjectId, ref: 'Product' },
    skuCode: { type: String, trim: true },
    barcode: { type: String, trim: true },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(PRODUCT_SKU_STATUS), default: PRODUCT_SKU_STATUS.ACTIVE },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Product_Sku', SKUSchema);
