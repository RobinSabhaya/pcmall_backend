import { faker } from '@faker-js/faker';

export const createUpdateSeller = {
  // sellerId : "seller id",
  name: faker.company.name(),
  businessEmail: faker.internet.email(),
  businessName: faker.finance.accountName(),
  gstNumber: faker.finance.accountNumber(),
  password: 'password',
  confirm_password: 'password',
};
