/* eslint-disable no-await-in-loop */
import axios from 'axios';

import { successColor } from '@/helpers/color.helper';
import { generateSKU } from '@/helpers/function.helper';
import { findOneAndUpdateDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';

import '@/models';
import { ICategory } from '../models/category';
import {
  IProduct,
  IProductBrand,
  IProductSKU,
  IProductVariant,
} from '../models/product';

// eslint-disable-next-line complexity
export async function fetchProducts(): Promise<void> {
  const data = await axios.get('https://dummyjson.com/products?limit=1000');
  const productData = data.data;

  for (let i = 0; i < productData.products.length; i++) {
    const product = productData.products[i];

    try {
      const brandPayload = {
        name: product?.brand,
        slug: product?.brand,
      };

      const brandData = await findOneAndUpdateDoc<IProductBrand>(
        MONGOOSE_MODELS.PRODUCT_BRAND,
        brandPayload,
        brandPayload,
        {
          new: true,
          upsert: true,
        }
      );

      const categoryPayload = {
        categoryName: product?.category,
        tags: product?.tags,
      };

      const productCategoryData = await findOneAndUpdateDoc<ICategory>(
        MONGOOSE_MODELS.CATEGORY,
        categoryPayload,
        categoryPayload,
        {
          new: true,
          upsert: true,
        }
      );

      const payload = {
        title: product?.title,
        slug: product?.title,
        description: product?.description,
        category: productCategoryData?._id,
        brand: brandData?._id,
        tags: product?.tags,
      };

      const productDetailsData = await findOneAndUpdateDoc<IProduct>(
        MONGOOSE_MODELS.PRODUCT,
        payload,
        payload,
        {
          new: true,
          upsert: true,
        }
      );

      const productVariantPayload = {
        product: productDetailsData?._id,
        name: productDetailsData?.title,
        images: product?.images,
        attributeCombination: {
          brand: brandData?.name ?? 'Brand',
          dimensions: product?.dimensions ?? {},
        },
      };

      const productVariantData = await findOneAndUpdateDoc<IProductVariant>(
        MONGOOSE_MODELS.PRODUCT_VARIANT,
        productVariantPayload,
        productVariantPayload,
        {
          new: true,
          upsert: true,
        }
      );

      const productSkuPayload = {
        seller: '683ae9fc5f6597738bf9dd6a',
        variant: productVariantData?._id,
        product: productDetailsData?._id,
        skuCode: generateSKU({
          name: String(productDetailsData?.title),
          category: productCategoryData?.categoryName ?? 'Category',
          brand: brandData?.name ?? 'Brand',
        }),
        barcode: generateSKU({
          name: String(productDetailsData?.title),
          category: productCategoryData?.categoryName ?? 'Category',
          brand: brandData?.name ?? 'Brand',
        }),
        price: Number((product?.price ?? 1) * 83).toFixed(2),
        discount: product?.discountPercentage ?? 0,
      };

      const productSkuData = await findOneAndUpdateDoc<IProductSKU>(
        MONGOOSE_MODELS.PRODUCT_SKU,
        productSkuPayload,
        productSkuPayload,
        {
          new: true,
          upsert: true,
        }
      );

      const productInventoryPayload = {
        sku: productSkuData?._id,
        warehouse: '683af08a5f6597738bf9e5a8',
        stock: product?.stock ?? 50,
        reserved: product?.minimumOrderQuantity ?? 5,
        inbound: 10,
        outbound: 10,
      };

      await findOneAndUpdateDoc(
        MONGOOSE_MODELS.PRODUCT_INVENTORY,
        productInventoryPayload,
        productInventoryPayload,
        {
          new: true,
          upsert: true,
        }
      );
      console.log(
        successColor,
        '✅ All Products saved successfully...',
        product?.id
      );
    } catch (error) {
      console.log('🚀 ~ fetchProducts ~ error:', error);
      return;
    }
  }
}
