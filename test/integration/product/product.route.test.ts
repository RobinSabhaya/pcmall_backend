import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { IProduct } from '../../../src/models/product';
import {
  createUpdateProduct,
  deleteProduct,
  DeleteProductSchema,
  generateProductSku,
} from '../../../src/validations/product.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';

import { createProductPayload, productSkuPayload } from './product.fixture';
import {
  ICreateProductResponse,
  IGenerateSkuResponse,
  IGetAllProductResponse,
} from './product.type';

describe('Product route Integration Tests', () => {
  let app: FastifyInstance;
  let productResponseData: IProduct | null = null;
  beforeAll(() => {
    app = buildApp();
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('POST /create-update', () => {
    test('should return 200 for valid POST request', async () => {
      const createProductPayloadData = await createProductPayload();
      // Validate the payload
      expect(
        validateReqPayload<typeof createProductPayloadData>(
          createUpdateProduct.body,
          createProductPayloadData
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<ICreateProductResponse>(
        app,
        'POST',
        '/v1/product/create-update',
        {
          headers: withAuth(),
          body: createProductPayloadData,
        }
      );

      // TODO: pending update

      // set data
      const { productData } = response.body.data;
      productResponseData = productData;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('POST /generate-sku', () => {
    test('should return 200 for valid POST request', async () => {
      const productSkuPayloadData = await productSkuPayload();
      // Validate the payload
      expect(
        validateReqPayload<typeof productSkuPayloadData>(
          generateProductSku.body,
          productSkuPayloadData
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<IGenerateSkuResponse>(
        app,
        'POST',
        '/v1/product/generate-sku',
        {
          headers: withAuth(),
          body: productSkuPayloadData,
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('POST /delete', () => {
    test('should return 200 for valid DELETE request', async () => {
      const deleteProductPayload: DeleteProductSchema = {
        productId: String((productResponseData as unknown as IProduct)?._id),
      };
      // Validate the payload
      expect(
        validateReqPayload<typeof deleteProductPayload>(
          deleteProduct.query,
          deleteProductPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest(app, 'DELETE', `/v1/product/delete`, {
        headers: withAuth(),
        query: deleteProductPayload,
      });

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('GET /all', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IGetAllProductResponse>(
        app,
        'GET',
        `/v1/product/all`,
        {
          headers: withAuth(),
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data.productData.results).toBeDefined();
    });
  });
});
