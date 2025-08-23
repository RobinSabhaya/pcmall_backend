import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductBrand, IProductVariant } from '@/models/product';

import { getTestData } from '../../scripts/fixture.seed';

let productVariantData: IProductVariant | null | undefined = null;
let productBrandData: IProductBrand | null | undefined = null;

await (async (): Promise<void> => {
  productVariantData = await getTestData<IProductVariant>(
    MONGOOSE_MODELS.PRODUCT_VARIANT
  );
  productBrandData = await getTestData<IProductBrand>(
    MONGOOSE_MODELS.PRODUCT_BRAND
  );
})();

export const createProductPayload = {
  name: faker.commerce.productName(),
  attributeCombination: {
    size: 'M',
  },
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  slug: faker.commerce.productName(),
  brand: productBrandData != null && (productBrandData as IProductBrand)?._id,
  modelNumber: faker.commerce.product(),
  tags: [faker.commerce.productAdjective(), faker.commerce.productAdjective()],
};

export const productSkuPayload = {
  variant:
    productVariantData != null &&
    String((productVariantData as IProductVariant)?._id),
  // productSkuId: "sku id",
  price: faker.commerce.price(),
  discount: faker.number.int(),
  tax: faker.number.int(),
};
