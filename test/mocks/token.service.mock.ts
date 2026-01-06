import { jest } from '@jest/globals';

export const mockTokenService = {
  generateAuthTokens: jest.fn(() => ({
    access: {
      token: 'access token',
      expires: new Date().toString(),
    },
    refresh: {
      token: 'refresh token',
      expires: new Date().toString(),
    },
  })),
  generateToken: jest.fn(),
  saveToken: jest.fn(),
  verifyToken: jest.fn(),
};
