import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import app from './app';
import { config } from './config/config';
import { errorHandler } from './utils/errorHandler';

const server = Fastify({ logger: true });

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

app(server)
  .then(async() => {
    return server.listen({
      port: +config.port! || 3000,
      host: config.host || '0.0.0.0',
    });
  })
  .catch(error => {
    server.log.error(error);
    throw error;
  });

server.setErrorHandler(errorHandler);
