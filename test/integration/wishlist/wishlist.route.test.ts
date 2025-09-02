import { FastifyInstance } from 'fastify';
import httpStatus from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '../../../src/app';
import { createUpdateWishlist } from '../../../src/validations/wishlist.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import { createUpdateWishlistPayload } from './wishlist.fixture';
import { ICreateUpdateWishlistResponse } from './wishlist.type';

describe('Wishlist route Integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    // setup database
    await setupDatabase();

    app = buildApp();
  });

  afterAll(async () => {
    await app?.close();

    // disconnect database
    await disconnectDatabase();
  });

  describe('POST /create-update', () => {
    test('should return 200 for valid POST request', async () => {
      expect(
        validateReqPayload(
          createUpdateWishlist.body,
          createUpdateWishlistPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<ICreateUpdateWishlistResponse>(
        app,
        'POST',
        `/v1/wishlist/create-update`,
        {
          headers: withAuth(),
          body: createUpdateWishlistPayload,
        }
      );

      // test casesMicrosoft.QuickAction.WiFi
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data).toBeDefined();
    });
  });
});
