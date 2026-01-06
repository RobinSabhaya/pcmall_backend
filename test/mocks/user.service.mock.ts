import { jest } from '@jest/globals';

export const mockUserService = {
  findOne: jest.fn(),
  create: jest.fn(),
  createUpdateUserProfile: jest.fn(),
};
