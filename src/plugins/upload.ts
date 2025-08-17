import multipart from '@fastify/multipart';
import fp from 'fastify-plugin';

export default fp(fastify => {
  fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB file limit
    },
  });
});
