import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '../../../src/app';
import { createUpdateWishlist } from '../../../src/validations/wishlist.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';

import { createUpdateWishlistPayload } from './wishlist.fixture';
import { ICreateUpdateWishlistResponse } from './wishlist.type';

describe('Wishlist route Integration', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = buildApp();
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('POST /create-update', () => {
    test('should return 200 for valid POST request', async () => {
      const createUpdateWishlistPayloadData =
        await createUpdateWishlistPayload();

      expect(
        validateReqPayload(
          createUpdateWishlist.body,
          createUpdateWishlistPayloadData
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<ICreateUpdateWishlistResponse>(
        app,
        'POST',
        `/v1/wishlist/create-update`,
        {
          headers: withAuth(),
          body: createUpdateWishlistPayloadData,
        }
      );

      // test casesMicrosoft.QuickAction.WiFi
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data).toBeDefined();
    });
  });
});
