import { FastifyInstance } from 'fastify';
import httpStatus from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { IPaginationResponse } from '../../../src/helpers/mongoose.helper';
import { ICart } from '../../../src/models/cart';
import {
  addToCart,
  removeToCart,
  RemoveToCartSchema,
} from '../../../src/validations/cart.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import { addToCartPayload } from './cart.fixtures';

describe('Cart route Integration Tests', () => {
  let app: FastifyInstance;
  let cartData: ICart | null = null;
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

  describe('POST /add', () => {
    test('should return 200 for valid POST request', async () => {
      // Validate the payload
      expect(
        validateReqPayload<typeof addToCartPayload>(
          addToCart.body,
          addToCartPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<{
        data: ICart;
      }>(app, 'POST', '/v1/cart/add', {
        headers: withAuth(),
        body: addToCartPayload,
      });

      // set cart data
      cartData = response.body.data;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('POST /remove/:cartId', () => {
    test('should return 200 for valid POST request', async () => {
      const removeToCartPayload: RemoveToCartSchema = {
        cartId: String(cartData?._id),
      };
      // Validate the payload
      expect(
        validateReqPayload<typeof removeToCartPayload>(
          removeToCart.params,
          removeToCartPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest(
        app,
        'DELETE',
        `/v1/cart/remove/${removeToCartPayload.cartId}`,
        {
          headers: withAuth(),
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('GET /all', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<{
        data: {
          items: IPaginationResponse<object[]>;
          totalQty: number;
        };
      }>(app, 'GET', `/v1/cart/all`, {
        headers: withAuth(),
      });

      // test cases
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data.items.results).toBeDefined();
    });
  });
});
