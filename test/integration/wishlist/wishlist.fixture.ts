import { MONGOOSE_MODELS } from '../../../src/helpers/mongoose.model.helper';
import { IProduct } from '../../../src/models/product';
import { disconnectDatabase } from '../../helpers/setupDatabase';
import { getTestData } from '../../scripts/fixture.seed';

let productData: IProduct | null | undefined = null;

await (async (): Promise<void> => {
  productData = await getTestData<IProduct>(MONGOOSE_MODELS.PRODUCT);
  await disconnectDatabase();
})();

export const createUpdateWishlistPayload = {
  productId: productData != null && String((productData as IProduct)?._id),
};
