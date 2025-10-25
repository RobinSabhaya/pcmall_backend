import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { IInventory } from '../../../src/models/inventory';
import {
  createUpdateInventory,
  deleteInventory,
  DeleteInventorySchema,
} from '../../../src/validations/inventory.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import { createUpdateInventoryPayload } from './inventory.fixture';
import {
  ICreateUpdateInventoryResponse,
  IGetAllInventoryResponse,
} from './inventory.type';

describe('Inventory route Integration Tests', () => {
  let app: FastifyInstance;
  let inventoryData: IInventory | null = null;
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
        validateReqPayload<typeof createUpdateInventoryPayload>(
          createUpdateInventory.body,
          createUpdateInventoryPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<ICreateUpdateInventoryResponse>(
        app,
        'POST',
        '/v1/inventory/create-update',
        {
          headers: withAuth(),
          body: createUpdateInventoryPayload,
        }
      );

      // TODO: pending update

      // set data
      inventoryData = response?.body?.data?.inventoryData;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('POST /delete', () => {
    test('should return 200 for valid DELETE request', async () => {
      const deleteInventoryPayload: DeleteInventorySchema = {
        inventoryId: String(inventoryData?._id),
      };
      // Validate the payload
      expect(
        validateReqPayload<typeof deleteInventoryPayload>(
          deleteInventory.query,
          deleteInventoryPayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest(
        app,
        'DELETE',
        `/v1/inventory/delete`,
        {
          headers: withAuth(),
          query: deleteInventoryPayload,
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('GET /all', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IGetAllInventoryResponse>(
        app,
        'GET',
        `/v1/inventory/all`,
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
