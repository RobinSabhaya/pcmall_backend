import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductVariant } from '@/models/product';

import { AddToCartSchema } from '../../../src/validations/cart.validation';
import { getTestData } from '../../scripts/fixture.seed';

export const addToCartPayload = async (): Promise<AddToCartSchema> => {
  const productVariantData = await getTestData<IProductVariant>(
    MONGOOSE_MODELS.PRODUCT_VARIANT
  );

  return {
    productVariantId: String((productVariantData as IProductVariant)?._id),
    quantity: 1,
  };
};
