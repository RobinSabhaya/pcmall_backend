import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '../../../src/app';
import { ISeller } from '../../../src/models/user';
import * as sellerValidation from '../../../src/validations/seller.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import { createUpdateSeller } from './seller.fixture';
import {
  ICreateUpdateSellerResponse,
  IDeleteSellerResponse,
  IGetAllSellersResponse,
} from './seller.type';

describe('Seller route Integration', () => {
  let app: FastifyInstance;
  let sellerData: ISeller | null = null;
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
      // Validate the payload
      expect(
        validateReqPayload<typeof createUpdateSeller>(
          sellerValidation.createUpdateSeller.body,
          createUpdateSeller
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<ICreateUpdateSellerResponse>(
        app,
        'POST',
        '/v1/seller/create-update',
        {
          headers: withAuth(),
          body: createUpdateSeller,
        }
      );

      // TODO: update pending

      sellerData = response?.body?.data?.sellerData;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('GET /all', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IGetAllSellersResponse>(
        app,
        'GET',
        `/v1/seller/all`,
        {
          headers: withAuth(),
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('DELETE /delete', () => {
    test('should return 200 for valid DELETE request', async () => {
      const deleteSellerPayload: sellerValidation.DeleteSellerSchema = {
        sellerId: String((sellerData as ISeller)?._id),
      };

      // Validate the payload
      expect(
        validateReqPayload<typeof deleteSellerPayload>(
          sellerValidation.deleteSeller.query,
          deleteSellerPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<IDeleteSellerResponse>(
        app,
        'DELETE',
        `/v1/seller/delete`,
        {
          headers: withAuth(),
          query: deleteSellerPayload,
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data).toBeDefined();
    });
  });
});
