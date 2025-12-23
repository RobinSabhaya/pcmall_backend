import { Category } from '../category/schema/category.schema';
import { IOption } from '../common/interfaces/common.interface';
import { Product } from '../product/schema/product.schema';
import { ProductBrand } from '../product-brand/schema/product-brand.schema';
import { ProductVariant } from '../product-variant/schema/product-variant.schema';

import { GenerateProductSkuDto } from './dto/product-sku.dto';
import { ProductSku } from './schema/product-sku.schema';

export interface IGenerateProductSkuResponse {
  success: boolean;
  message: string;
  data: {
    productData: IProductPopulated | null;
    productSkuData: ProductSku | null;
  };
}

export interface IGenerateProductSku {
  message: string;
  productData: IProductPopulated | null;
  productSkuData: ProductSku | null;
}

export interface IHandleProductSkuOperation {
  productSkuData: ProductSku | null;
  message: string;
}

export interface IGenerateSKUPayload {
  productData: IProductPopulated;
  productVariantData: ProductVariant | null;
  price?: number;
  discount?: number;
  tax?: number;
}

export interface IHandleProductSkuPayload {
  productData: IProductPopulated;
  productVariantData: ProductVariant | null;
  generateProductSkuDto: GenerateProductSkuDto;
  options: IOption;
}

export interface IBuildSKUPayload {
  productData: IProductPopulated;
  productVariantData: ProductVariant | null;
}

export interface IProductPopulated extends Product {
  brand: ProductBrand;
  category: Category;
}
