import { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { addToCart } from '../../../src/validations/cart.validation';
import { validateReqPayload } from '../../helpers/function.helper';

import { addToCartPayload } from './cart.fixtures';

describe('Cart route Integration Tests', () => {
  let app: FastifyInstance;
  beforeAll(() => {
    app = buildApp();
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('POST /add', () => {
    test('should return 200 for valid POST request', () => {
      // Validate the payload
      expect(
        validateReqPayload<typeof addToCartPayload>(
          addToCart.body,
          addToCartPayload
        )
      ).toBe(true);

      // make request
      // const response = await makeRequest(app, 'POST', '/v1/cart/add', {
      //   headers : withAuth(),
      //   body: addToCartPayload,
      // });
      // test cases
      // expectSuccessResponse(response, httpStatus.OK);
    });
  });

  // describe('POST /add', () => {
  //   test('should return 200 for valid POST request', async () => {
  //     const removeToCartPayload:RemoveToCartSchema = {
  //       cartId : ""
  //     }

  //     // Validate the payload
  //     expect(
  //       validateReqPayload<typeof removeToCartPayload>(
  //         removeToCart.params,
  //         removeToCartPayload
  //       )
  //     ).toBe(true);

  //     // make request
  //     const response = await makeRequest(app, 'DELETE', '/v1/remove/:cartId', {
  //       headers: withAuth(),
  //       body: addToCartPayload,
  //     });
  //     // test cases
  //     expectSuccessResponse(response, httpStatus.OK);
  //   });
  // });
});
