import { describe, test } from 'vitest';

describe('Global Error Handling', () => {
  test('Global handling', () => {});
  // test('should handle 401 - Invalid Token', async () => {
  //   const response = await makeRequest(app, 'GET', '/auth.', {
  //     headers: withAuth('Bearer invalid_token'),
  //   });
  //   expectErrorResponse(response, 401);
  // });

  // test('should handle 403 - Expired Token', async () => {
  //   const response = await makeRequest(app, 'GET', '/auth.', {
  //     // headers: withAuth('Bearer expired_token'),
  //   });
  //   if (response.statusCode === 403) {
  //     expectErrorResponse(response, 403, 'Forbidden');
  //   }
  // });

  // test('should handle 429 - Rate Limit', async () => {
  //   const requests = Array.from({ length: 5 }, async () =>
  //     makeRequest(app, 'GET', '/auth.', { headers: withAuth() })
  //   );

  //   const responses = await Promise.all(requests);
  //   const rateLimited = responses.some(r => r.statusCode === 429);
  //   if (rateLimited) {
  //     const errorResponse = responses.find(r => r.statusCode === 429);
  //     expectErrorResponse(errorResponse!, 429);
  //   }
  // });

  // test('should handle 500 - Server Error', async () => {
  //   const response = await makeRequest(app, 'POST', '/auth.', {
  //     headers: { 'Content-Type': 'application/json' },
  //     body: 'invalid-json',
  //   });
  //   if (response.statusCode === 500) {
  //     expectErrorResponse(response, 500);
  //   }
  // });

  // test('should return 404 for non-existent resource', async () => {
  //   const response = await makeRequest(app, 'DELETE', '/auth./999999', {
  //     headers: withAuth(),
  //   });
  //   if (response.statusCode === 404) {
  //     expectErrorResponse(response, 404);
  //   }
  // });

  // test('should return 401 for missing authentication', async () => {
  //   const response = await makeRequest(app, 'DELETE', '/auth./1');
  //   expectErrorResponse(response, 401);
  // });
});
