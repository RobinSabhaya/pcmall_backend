import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductBrand, IProductVariant } from '@/models/product';

import { ICategory } from '../../../src/models/category';
import {
  CreateUpdateProductSchema,
  GenerateProductSkuSchema,
} from '../../../src/validations/product.validation';
import { getTestData } from '../../scripts/fixture.seed';

export const createProductPayload =
  async (): Promise<CreateUpdateProductSchema> => {
    const productBrandData = await getTestData<IProductBrand>(
      MONGOOSE_MODELS.PRODUCT_BRAND
    );
    const categoryData = await getTestData<ICategory>(MONGOOSE_MODELS.CATEGORY);

    return {
      name: faker.commerce.productName(),
      attributeCombination: {},
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      slug: faker.commerce.productName(),
      brand: String(productBrandData?._id ?? ''),
      modelNumber: faker.commerce.product(),
      tags: [
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
      ],
      category: String(categoryData?._id ?? ''),
    };
  };

export const productSkuPayload =
  async (): Promise<GenerateProductSkuSchema> => {
    const productVariantData = await getTestData<IProductVariant>(
      MONGOOSE_MODELS.PRODUCT_VARIANT
    );

    return {
      variantId: String(productVariantData?._id ?? ''),
      // productSkuId: "sku id",
      price: +faker.commerce.price(),
      discount: faker.number.int(),
      tax: faker.number.int(),
    };
  };
