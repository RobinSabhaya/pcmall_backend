import { Types } from 'mongoose';

import { ICategory } from '@/models/category';
import { IProduct, IProductBrand, IProductVariant } from '@/models/product';

export interface IGetAllProductsFilter {
  productId?: Types.ObjectId;
  categories?: object;
  gender?: object;
  colors?: object;
  prices?: object;
  slug?: string;
  $or?: Array<object>;
}

export interface IProductPopulated
  extends Omit<IProduct, 'brand' | 'category'> {
  brand: Pick<IProductBrand, '_id' | 'name'>;
  category: Pick<ICategory, '_id' | 'categoryName'>;
}

export interface IGenerateSKUPayload {
  productData: IProductPopulated;
  productVariantData: IProductVariant;
  price?: number;
  discount?: number;
  tax?: number;
}
