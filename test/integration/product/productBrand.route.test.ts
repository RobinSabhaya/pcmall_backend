import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { IProductBrand } from '../../../src/models/product';
import {
  createUpdateBrand,
  deleteBrand,
  DeleteBrandSchema,
} from '../../../src/validations/brand.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import {
  ICreateProductBrandResponse,
  IGetAllProductBrandResponse,
} from './brand.type';
import { createUpdateProductBrand } from './productBrand.fixture';

describe('Product Brand route Integration Tests', () => {
  let app: FastifyInstance;
  let productBrandData: IProductBrand | null = null;
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
        validateReqPayload<typeof createUpdateProductBrand>(
          createUpdateBrand.body,
          createUpdateProductBrand
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<ICreateProductBrandResponse>(
        app,
        'POST',
        '/v1/product-brand/create-update',
        {
          headers: withAuth(),
          body: createUpdateProductBrand,
        }
      );

      // TODO: pending update

      // set data
      const { data } = response.body;
      productBrandData = data?.brandData;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('POST /delete', () => {
    test('should return 200 for valid DELETE request', async () => {
      const deleteProductBrandPayload: DeleteBrandSchema = {
        brandId: String((productBrandData as unknown as IProductBrand)?._id),
      };
      // Validate the payload
      expect(
        validateReqPayload<typeof deleteProductBrandPayload>(
          deleteBrand.query,
          deleteProductBrandPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest(
        app,
        'DELETE',
        `/v1/product-brand/delete`,
        {
          headers: withAuth(),
          query: deleteProductBrandPayload,
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('GET /all', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IGetAllProductBrandResponse>(
        app,
        'GET',
        `/v1/product-brand/all`,
        {
          headers: withAuth(),
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data.brandData).toBeDefined();
    });
  });
});
