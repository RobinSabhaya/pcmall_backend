import { ProductBrand } from './schema/product-brand.schema';

export interface ICreateUpdateProductBrandResponse {
  success: boolean;
  message: string;
  data: {
    productBrandData: ProductBrand | null;
  };
}

export interface ICreateUpdateProductBrand {
  message: string;
  productBrandData: ProductBrand | null;
}

export interface IDeleteProductBrandResponse {
  success: boolean;
  message: string;
  data: {
    productBrandData: ProductBrand | null;
  };
}

export interface IDeleteProductBrand {
  message: string;
  productBrandData: ProductBrand | null;
}

export interface IGetAllProductBrandResponse {
  success: boolean;
  data: {
    productBrandData: ProductBrand[];
  };
}

export interface IGetAllProductBrand {
  productBrandData: ProductBrand[];
}
