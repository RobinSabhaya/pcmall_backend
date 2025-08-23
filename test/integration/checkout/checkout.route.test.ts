import { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, test } from 'vitest';

import buildApp from '@/app';

import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

describe('Checkout route Integration Tests', () => {
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

  describe('POST /', () => {
    // test('should return 200 for valid POST request', async () => {
    //   // Validate the payload
    //         expect(
    //           validateReqPayload<typeof createCheckoutPayload>(
    //             checkout.body,
    //             createCheckoutPayload
    //           )
    //         ).toBe(true);
    //         console.log('-',createCheckoutPayload)

    //   // make request
    //   const response = await makeRequest(app, 'POST', `/v1/checkout`, {
    //     headers: withAuth(),
    //     body : createCheckoutPayload
    //   });

    //   // test cases
    //   expectSuccessResponse(response, httpStatus.OK);

    //   // check at least one item exists
    //   // expect(response.body.data.length).toBe(0)
    // });
    test('test', () => {});
  });
});
