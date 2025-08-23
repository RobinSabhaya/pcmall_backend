import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IUser } from '@/models/user';

import { getTestData } from '../../scripts/fixture.seed';

let userData: IUser | null | undefined = null;

await (async (): Promise<void> => {
  userData = await getTestData<IUser>(MONGOOSE_MODELS.USER);
})();

export const createUpdateUser = {
  user: userData != null && String((userData as IUser)?._id),
  line1: faker.location.streetAddress(),
  state: faker.location.state(),
  country: faker.location.country(),
  city: faker.location.city(),
};
