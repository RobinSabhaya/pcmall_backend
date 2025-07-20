import { IBaseDocumentModel } from "@/types/mongoose.types";
import { Document, model, Schema } from "mongoose";

export interface ISeller extends Document,IBaseDocumentModel {
  user: Schema.Types.ObjectId;
  name: string;
  businessEmail: string;
  businessName: string;
  gstNumber: string;
}

const SellerSchema = new Schema<ISeller>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: { type: String },
    businessEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    businessName: { type: String },
    gstNumber: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Seller = model<ISeller>('Seller', SellerSchema);
