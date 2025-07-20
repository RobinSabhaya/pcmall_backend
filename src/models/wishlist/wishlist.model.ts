import { Document, model, Schema } from "mongoose";

export interface IWishlist extends Document {
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);

export const wishlistModel = model<IWishlist>('wishlist', wishlistSchema);