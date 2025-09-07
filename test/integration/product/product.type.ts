import { IPaginationResponse } from '../../../src/helpers/mongoose.helper';
import {
  IProduct,
  IProductSKU,
  IProductVariant,
} from '../../../src/models/product';

export interface ICreateProductResponse {
  data: {
    productData: IProduct;
    productVariantData: IProductVariant;
  };
}

export interface IGetAllProductResponse {
  data: {
    productData: IPaginationResponse<IProduct>;
  };
}

export interface IGenerateSkuResponse {
  data: IProductSKU;
}
