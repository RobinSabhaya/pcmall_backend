import { IBaseDocumentModel } from "@/types/mongoose.types";
import { Document, model, Schema } from "mongoose";

export interface IProductVariant extends Document,IBaseDocumentModel {
  product: Schema.Types.ObjectId;
  name: string;
  attributeCombination: object;
  images: Array<string>;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

const VariantSchema = new Schema<IProductVariant>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    attributeCombination: { type: Object },
    images: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
);

export const Product_Variant = model<IProductVariant>('Product_Variant', VariantSchema);
