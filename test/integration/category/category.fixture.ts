import { faker } from '@faker-js/faker';

export const createUpdateCategory = {
  categoryName: 'Category',
  tags: [faker.commerce.productAdjective(), faker.commerce.productAdjective()],
};
