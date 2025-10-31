import { MONGOOSE_MODELS } from '../../../src/helpers/mongoose.model.helper';
import { IProduct } from '../../../src/models/product';
import { getTestData } from '../../scripts/fixture.seed';

export async function createUpdateWishlistPayload(): Promise<{
  productId: string;
}> {
  const productData = await getTestData<IProduct>(MONGOOSE_MODELS.PRODUCT);
  return {
    productId: String(productData?._id),
  };
}
