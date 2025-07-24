import { ICategory } from '@/models/category';
import { IProduct, IProductBrand } from '@/models/product';
import { Schema } from 'mongoose';

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

export interface IProductPopulated extends Omit<IProduct, 'brand' | 'category'> {
  brand: Pick<IProductBrand, '_id' | 'name'>;
  category: Pick<ICategory, '_id' | 'categoryName'>;
}
