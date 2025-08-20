import z from 'zod';

import { userOneAccessToken } from '../fixtures/token.fixture';

export function withAuth(
  token: string = userOneAccessToken
): Record<string, string> {
  return { Authorization: token };
}

export function validateReqPayload<T>(
  schema: z.ZodSchema,
  payload: T
): boolean {
  return Boolean(schema.parse(payload));
}
