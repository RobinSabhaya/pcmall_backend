import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IAddress } from '@/models/user/address.model';

import { CreateUpdateBrandSchema } from '../../../src/validations/brand.validation';
import { getTestData } from '../../scripts/fixture.seed';

export const createUpdateProductBrand =
  async (): Promise<CreateUpdateBrandSchema> => {
    const addressData = await getTestData<IAddress>(MONGOOSE_MODELS.ADDRESS);

    return {
      // brandId : "brand id",
      name: faker.company.name(),
      slug: faker.company.name(),
      description: faker.location.streetAddress(),
      mission: faker.company.catchPhrase(),
      vision: faker.company.catchPhrase(),
      logo: faker.image.avatar(),
      bannerImage: faker.image.url(),
      website: faker.internet.domainName(),
      contactEmail: faker.internet.email(),
      contactPhone: faker.phone.number({ style: 'national' }),
      headquarters: String(addressData?._id ?? ''),
      foundedYear: new Date().getFullYear(),
      founder: faker.person.fullName(),
      ceo: faker.person.fullName(),
      status: 'active',
    };
  };
