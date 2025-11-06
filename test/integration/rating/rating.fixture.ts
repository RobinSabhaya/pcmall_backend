import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProduct } from '@/models/product';

import { CreateUpdateRatingSchema } from '../../../src/validations/rating.validation';
import { getTestData } from '../../scripts/fixture.seed';

export const createUpdateRating =
  async (): Promise<CreateUpdateRatingSchema> => {
    const productData = await getTestData<IProduct>(MONGOOSE_MODELS.PRODUCT);

    return {
      productId: String(productData?._id ?? ''),
      rating: faker.number.float(),
      message: `Great product ${faker.commerce.productName()}`,
      // ratingId: "rating id",
      // images: "image",
    };
  };
