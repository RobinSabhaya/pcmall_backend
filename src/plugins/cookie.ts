import fp from 'fastify-plugin';

import { config } from '../config/config';

export default fp(async fastify => {
  await fastify.register(import('@fastify/cookie'), {
    secret: config.cookie.cookieSecret,
  });
});
