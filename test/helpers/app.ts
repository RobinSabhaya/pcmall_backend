import { FastifyInstance } from 'fastify';

import buildApp from '../../src/app';

function build(): FastifyInstance {
  return buildApp();
}

export { build };
