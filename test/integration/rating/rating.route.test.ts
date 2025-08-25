import { FastifyInstance } from 'fastify';
import httpStatus from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { IRating } from '../../../src/models/rating';
import * as ratingValidation from '../../../src/validations/rating.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import { createUpdateRating } from './rating.fixture';
import { IGetAllRatings, IRatingCount } from './rating.type';

describe('Rating route Integration Tests', () => {
  let app: FastifyInstance;
  let ratingData: IRating | null = null;
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
      // Convert payload into equivalent multi-part form data
      const ratingFormData = new FormData();

      ratingFormData.append('productId', createUpdateRating.productId);
      ratingFormData.append('rating', createUpdateRating.rating);
      ratingFormData.append('message', createUpdateRating.message);

      // Validate the payload
      expect(
        validateReqPayload<typeof createUpdateRating>(
          ratingValidation.createUpdateRating.body,
          createUpdateRating
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<{
        data: IRating;
      }>(app, 'POST', '/v1/rating/create-update', {
        headers: withAuth(),
        body: ratingFormData,
      });

      // TODO: pending update

      // set data
      ratingData = response.body.data;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('GET /all', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IGetAllRatings>(
        app,
        'GET',
        `/v1/rating/all`,
        {
          headers: withAuth(),
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data.results).toBeDefined();
    });
  });

  describe('GET /count', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IRatingCount>(
        app,
        'GET',
        `/v1/rating/count`,
        {
          headers: withAuth(),
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data.ratingCount).toBeDefined();
    });
  });

  describe('POST /delete', () => {
    test('should return 200 for valid DELETE request', async () => {
      const removeRatingPayload: ratingValidation.DeleteRatingSchema = {
        ratingId: String(ratingData?._id),
      };

      // Validate the payload
      expect(
        validateReqPayload<typeof removeRatingPayload>(
          ratingValidation.deleteRating.query,
          removeRatingPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest(app, 'DELETE', `/v1/rating/delete`, {
        headers: withAuth(),
        query: removeRatingPayload,
      });

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });
});
