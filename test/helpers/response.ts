import httpStatus from 'http-status';
import { expect } from 'vitest';

import { ITestResponse } from './request.helper';

export function expectErrorResponse(
  response: ITestResponse,
  statusCode: number,
  message?: string
): void {
  expect(response.statusCode).toBe(statusCode);
  expect(response.body).toHaveProperty('error');
  if (message != null) {
    expect(response.body).toContain(message);
  }
}

export function expectSuccessResponse(
  response: ITestResponse,
  statusCode: number = httpStatus.OK
): void {
  expect(response.statusCode).toBe(statusCode);
  expect(response.body).toBeDefined();
}
