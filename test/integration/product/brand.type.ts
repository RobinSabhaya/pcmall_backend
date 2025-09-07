import { IProductBrand } from '../../../src/models/product';

export interface ICreateProductBrandResponse {
  data: { brandData: IProductBrand };
}

export interface IGetAllProductBrandResponse {
  data: { brandData: IProductBrand[] };
}
