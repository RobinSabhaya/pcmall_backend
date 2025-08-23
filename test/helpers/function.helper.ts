import z from 'zod';

import { MONGOOSE_MODELS } from '../../src/helpers/mongoose.model.helper';
import { IToken } from '../../src/models/auth';
import { getTestData } from '../scripts/fixture.seed';

// import { disconnectDatabase } from './setupDatabase';

let tokenData: IToken | null | undefined = null;

await (async (): Promise<void> => {
  tokenData = await getTestData<IToken>(MONGOOSE_MODELS.TOKEN, {
    type: 'access',
  });
  // await disconnectDatabase();
})();

export function withAuth(
  token: string = String(tokenData?.token)
): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export function validateReqPayload<T>(
  schema: z.ZodSchema,
  payload: T
): boolean {
  return Boolean(schema.parse(payload));
}
