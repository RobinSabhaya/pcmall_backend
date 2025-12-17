import { ProductVariant } from '../product_variant/schema/product-variant.schema';

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
