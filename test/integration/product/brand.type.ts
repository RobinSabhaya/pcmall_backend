import { IProductBrand } from '../../../src/models/product';

export interface ICreateProductBrandResponse {
  data: IProductBrand;
}

export interface IGetAllProductBrandResponse {
  data: IProductBrand[];
}
