import { faker } from '@faker-js/faker';

// Register payload
export const registerPayload = {
  first_name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password',
  confirm_password: 'password',
};

// Signup payload
export const signupPayload = {
  ...registerPayload,
};

// Login payload
export const loginPayload = {
  email: registerPayload.email,
  password: 'password',
};
