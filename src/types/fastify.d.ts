import { FastifyReply } from 'fastify';

import { IUser } from '../models/user';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyRequest {
    user?: IUser;
    rawBody: Buffer;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyInstance {
    authorizeV1: (
      ...requiredRights: string[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
