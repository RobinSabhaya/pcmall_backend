import { ObjectId } from 'mongoose';

import { generateSKU, IGenerateSKU } from '../../helpers/function.helper';
import { IProductVariant } from '../../models/product';

import { IGenerateSKUPayload, IProductPopulated } from './product.service.type';

export const getDefaultValue = (value: string): string => {
  return value;
};

export const buildSKUPayload = ({
  productData,
  productVariantData,
}: {
  productData: IProductPopulated;
  productVariantData: IProductVariant;
}): IGenerateSKU => {
  const categoryName = productData?.category?.categoryName;
  const brandName = productData?.brand?.name;

  return {
    name: productData?.title,
    category: getDefaultValue(categoryName),
    brand: getDefaultValue(brandName),
    variants: productVariantData?.attributeCombination,
  };
};

export const generateSKUPayload = (payload: IGenerateSKUPayload): unknown => {
  const { productData, productVariantData, price, discount, tax } = payload;

  const skuPayload = buildSKUPayload({ productData, productVariantData });

  return {
    variant: productVariantData?._id as ObjectId,
    product: productData?._id as ObjectId,
    skuCode: generateSKU(skuPayload),
    price,
    discount,
    tax,
  };
};
