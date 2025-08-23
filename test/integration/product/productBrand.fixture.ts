import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IAddress } from '@/models/user/address.model';

import { getTestData } from '../../scripts/fixture.seed';

let addressData: IAddress | null | undefined = null;

await (async (): Promise<void> => {
  addressData = await getTestData<IAddress>(MONGOOSE_MODELS.ADDRESS);
})();

export const createUpdateProductBrand = {
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
  headquarters: addressData != null && String((addressData as IAddress)?._id),
  foundedYear: new Date().getFullYear(),
  founder: faker.person.fullName(),
  ceo: faker.person.fullName(),
  status: 'active',
  totalRating: 4.5,
};
