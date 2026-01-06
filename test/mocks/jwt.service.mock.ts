import { jest } from '@jest/globals';

export const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};
