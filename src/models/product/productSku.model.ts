import { Document, model, Schema } from 'mongoose';
import { PRODUCT_SKU_STATUS } from '../../helpers/constant.helper';
import { IBaseDocumentModel } from '@/types/mongoose.types';

export interface IProductSKU extends Document, IBaseDocumentModel {
  _id: Schema.Types.ObjectId;
  seller: Schema.Types.ObjectId;
  variant: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  skuCode: string;
  barcode: string;
  price: number;
  discount: number;
  tax: number;
  status: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

const SKUSchema = new Schema<IProductSKU>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'Seller' },
    variant: { type: Schema.Types.ObjectId, ref: 'Variant' },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    skuCode: { type: String, trim: true },
    barcode: { type: String, trim: true },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(PRODUCT_SKU_STATUS),
      default: PRODUCT_SKU_STATUS.ACTIVE,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false },
);

export const Product_Sku = model<IProductSKU>('Product_Sku', SKUSchema);
