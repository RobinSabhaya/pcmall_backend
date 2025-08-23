import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductVariant } from '@/models/product';
import { disconnectDatabase } from 'test/helpers/setupDatabase';

import { getTestData } from '../../scripts/fixture.seed';

let productVariantData: IProductVariant | null | undefined = null;

await (async (): Promise<void> => {
  productVariantData = await getTestData<IProductVariant>(
    MONGOOSE_MODELS.PRODUCT_VARIANT
  );
  await disconnectDatabase();
})();

export const addToCartPayload = {
  productVariantId:
    productVariantData != null &&
    String((productVariantData as IProductVariant)?._id),
  quantity: 1,
};
