import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import { IGetAllCategoriesResponse } from './category.type';

describe('Category route Integration Tests', () => {
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

  describe('GET /all', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IGetAllCategoriesResponse>(
        app,
        'GET',
        `/v1/category/all`,
        {
          headers: withAuth(),
        }
      );
      // test cases
      expectSuccessResponse(response, httpStatus.OK);
      // check at least one item exists
      expect(response.body.data).toBeDefined();
    });
  });
});
