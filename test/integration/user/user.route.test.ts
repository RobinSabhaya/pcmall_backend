import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { IAddress } from '../../../src/models/user';
import {
  deleteAddress,
  DeleteAddressSchema,
  updateAddress,
  updateUser,
} from '../../../src/validations/user.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import { createUpdateUser, updateAddressPayload } from './user.fixture';
import {
  IAddressUpdateResponse,
  IGetDetailsResponse,
  IUpdateUserResponse,
} from './user.type';

describe('User route Integration Tests', () => {
  let app: FastifyInstance;
  let addressData: IAddress | null = null;
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

  describe('PUT /update', () => {
    test('should return 200 for valid PUT request', async () => {
      // Validate the payload
      expect(
        validateReqPayload<typeof createUpdateUser>(
          updateUser.body,
          createUpdateUser
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<IUpdateUserResponse>(
        app,
        'PUT',
        '/v1/user/update',
        {
          headers: withAuth(),
          body: createUpdateUser,
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('GET /details', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IGetDetailsResponse>(
        app,
        'GET',
        `/v1/user/details`,
        {
          headers: withAuth(),
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('PUT /address/update', () => {
    test('should return 200 for valid PUT request', async () => {
      // Validate the payload
      expect(
        validateReqPayload<typeof updateAddressPayload>(
          updateAddress.body,
          updateAddressPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<IAddressUpdateResponse>(
        app,
        'PUT',
        `/v1/user/address/update`,
        {
          headers: withAuth(),
          body: updateAddressPayload,
        }
      );

      // set data
      addressData = response?.body?.data?.addressData;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data).toBeDefined();
    });
  });

  describe('DELETE /address/delete', () => {
    test('should return 200 for valid DELETE request', async () => {
      const deleteAddressPayload: DeleteAddressSchema = {
        addressId: String((addressData as IAddress)?._id),
      };

      // Validate the payload
      expect(
        validateReqPayload<typeof deleteAddressPayload>(
          deleteAddress.query,
          deleteAddressPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<IAddressUpdateResponse>(
        app,
        'DELETE',
        `/v1/user/address/delete`,
        {
          headers: withAuth(),
          query: updateAddressPayload,
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data).toBeDefined();
    });
  });
});
