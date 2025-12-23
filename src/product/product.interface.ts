import { Types } from 'mongoose';

import { ProductVariant } from '../product-variant/schema/product-variant.schema';

import { Product } from './schema/product.schema';

export interface ICreateUpdateProductResponse {
  success: boolean;
  message: string;
  data: {
    productData: Product | null;
    productVariantData: ProductVariant | null;
  };
}

export interface ICreateUpdateProduct {
  message: string;
  productData: Product | null;
  productVariantData: ProductVariant | null;
}

export interface IDeleteProduct {
  productData: Product | null;
  message: string;
}

export interface IDeleteProductResponse {
  success: boolean;
  message: string;
  data: { productData: Product | null };
}

export interface IGetAllProductsResponse {
  success: true;
  data: { productData: Product };
}

export type IGetAllProducts = Product[];

export interface IGetAllProductsFilter {
  productId?: Types.ObjectId;
  categories?: object;
  gender?: object;
  colors?: object;
  prices?: {
    price: { $gte: number; $lte: number };
  };
  slug?: string;
  $or?: object[];
  search?: string;
}
