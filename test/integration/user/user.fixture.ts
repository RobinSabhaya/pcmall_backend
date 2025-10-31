import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IAddress } from '@/models/user';

import { UpdateAddressSchema } from '../../../src/validations/user.validation';
import { getTestData } from '../../scripts/fixture.seed';

export const createUpdateUser = {
  line1: faker.location.streetAddress(),
  state: faker.location.state(),
  country: faker.location.country(),
  city: faker.location.city(),
};

export const updateAddressPayload = async (): Promise<UpdateAddressSchema> => {
  const addressData = await getTestData<IAddress>(MONGOOSE_MODELS.ADDRESS);

  return {
    addressId: String(addressData?._id ?? ''),
    line1: faker.location.streetAddress(),
    state: faker.location.state(),
    country: faker.location.country(),
    city: faker.location.city(),
  };
};
