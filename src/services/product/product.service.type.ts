import { Schema } from "mongoose";

export interface GetAllProductsFilter {
  _id?: Schema.Types.ObjectId;
  categories?: object;
  colors?: object;
  prices?: object;
  $or?: Array<object>;
}

export interface GetAllProductsFilter {
  _id?: Schema.Types.ObjectId;
  categories?: object;
  colors?: object;
  prices?: object;
  $or?: Array<object>;
}
