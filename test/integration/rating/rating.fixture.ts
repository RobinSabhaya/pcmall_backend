import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProduct } from '@/models/product';

import { getTestData } from '../../scripts/fixture.seed';

let productData: IProduct | null | undefined = null;

await (async (): Promise<void> => {
  productData = await getTestData<IProduct>(MONGOOSE_MODELS.PRODUCT);
})();

export const createUpdateRating = {
  productId: productData != null && String((productData as IProduct)?._id),
  rating: faker.number.float(),
  message: `Great product ${faker.commerce.productName()}`,
  // ratingId: "rating id",
  // images: "image",
};
