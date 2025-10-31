import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import {
  login,
  logout,
  refreshTokens,
  register,
  signup,
} from '../../../src/validations/auth.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';

import { loginPayload, registerPayload, signupPayload } from './auth.fixture';

describe('Auth route Integration Tests', () => {
  let app: FastifyInstance;
  let accessToken: string, refreshToken: string;
  beforeAll(() => {
    app = buildApp();
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('POST /register', () => {
    test('should return 201 for valid POST request', async () => {
      // Validate the payload
      expect(
        validateReqPayload<typeof registerPayload>(
          register.body,
          registerPayload
        )
      ).toBe(true);
      // make request
      const response = await makeRequest(app, 'POST', '/v1/auth/register', {
        body: registerPayload,
      });
      // test cases
      expectSuccessResponse(response, httpStatus.CREATED);
    });
  });

  describe('POST /signup', () => {
    test('Should return 500 for valid POST request', async () => {
      // Validate the payload
      expect(
        validateReqPayload<typeof signupPayload>(signup.body, signupPayload)
      ).toBe(true);

      // make request
      const response = await makeRequest(app, 'POST', '/v1/auth/signup', {
        body: signupPayload,
      });

      // test cases
      expectSuccessResponse(response, httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 for valid POST request', async () => {
      // Validate the payload
      expect(
        validateReqPayload<typeof loginPayload>(login.body, loginPayload)
      ).toBe(true);

      // make request
      const response = await makeRequest<{
        data: {
          tokens: {
            access: {
              token: string;
              expires: Date;
            };
            refresh: {
              token: string;
              expires: Date;
            };
          };
        };
      }>(app, 'POST', '/v1/auth/login', {
        body: loginPayload,
      });

      accessToken = response.body.data.tokens.access.token;
      refreshToken = response.body.data.tokens.refresh.token;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('POST /refresh-token', () => {
    test('Should return 200 for valid POST request', async () => {
      const refreshTokenPayload = {
        refreshToken,
      };

      // Validate the payload
      expect(
        validateReqPayload<typeof refreshTokenPayload>(
          refreshTokens.body,
          refreshTokenPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest(
        app,
        'POST',
        '/v1/auth/refresh-tokens',
        {
          // headers: withAuth(accessToken),
          body: refreshTokenPayload,
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('POST /logout', () => {
    test('Should return 200 for valid POST request', async () => {
      const logoutPayload = {
        refreshToken,
      };

      // Validate the payload
      expect(
        validateReqPayload<typeof logoutPayload>(logout.body, logoutPayload)
      ).toBe(true);

      // make request
      const response = await makeRequest(app, 'POST', '/v1/auth/logout', {
        headers: withAuth(accessToken),
        body: logoutPayload,
      });

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });
});
