import { FastifyInstance } from 'fastify';
import { status as httpStatus } from 'http-status';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import buildApp from '@/app';

import { IWarehouse } from '../../../src/models/warehouse';
import * as warehouseValidation from '../../../src/validations/warehouse.validation';
import { validateReqPayload, withAuth } from '../../helpers/function.helper';
import { makeRequest } from '../../helpers/request.helper';
import { expectSuccessResponse } from '../../helpers/response';
import { disconnectDatabase, setupDatabase } from '../../helpers/setupDatabase';

import { createUpdateWarehouse } from './warehouse.fixture';
import {
  ICreateUpdateWarehouseResponse,
  IGetAllWarehousesResponse,
} from './warehouse.type';

describe('Warehouse route Integration Tests', () => {
  let app: FastifyInstance;
  let warehouseData: IWarehouse | null = null;
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
        validateReqPayload<typeof createUpdateWarehouse>(
          warehouseValidation.createUpdateWarehouse.body,
          createUpdateWarehouse
        )
      ).toBe(true);

      // make request
      const response = await makeRequest<ICreateUpdateWarehouseResponse>(
        app,
        'POST',
        '/v1/warehouse/create-update',
        {
          headers: withAuth(),
          body: createUpdateWarehouse,
        }
      );

      // set data
      warehouseData = response?.body?.data?.warehouseData;

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });

  describe('GET /all', () => {
    test('should return 200 for valid GET request', async () => {
      // make request
      const response = await makeRequest<IGetAllWarehousesResponse>(
        app,
        'GET',
        `/v1/warehouse/all`,
        {
          headers: withAuth(),
        }
      );

      // test casesMicrosoft.QuickAction.WiFi
      expectSuccessResponse(response, httpStatus.OK);

      // check at least one item exists
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /delete', () => {
    test('should return 200 for valid DELETE request', async () => {
      const deleteWarehousePayload: warehouseValidation.DeleteWarehouseSchema =
        {
          warehouseId: String(warehouseData?._id),
        };
      // Validate the payload
      expect(
        validateReqPayload<typeof deleteWarehousePayload>(
          warehouseValidation.deleteWarehouse.query,
          deleteWarehousePayload
        )
      ).toBe(true);

      // make request
      const response = await makeRequest(
        app,
        'DELETE',
        `/v1/warehouse/delete`,
        {
          headers: withAuth(),
          query: deleteWarehousePayload,
        }
      );

      // test cases
      expectSuccessResponse(response, httpStatus.OK);
    });
  });
});
