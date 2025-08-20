import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import buildApp from './app';
import { config } from './config/config';
import { errorHandler } from './utils/errorHandler';

const server = buildApp();

const start = (): void => {
  server
    .listen({
      port: +config.port! || 3000,
      host: config.host || '0.0.0.0',
    })
    .then(() => {
      console.log(`Server running at ${config.port}`);
      return null;
    })
    .catch(error => {
      console.log(`Server failed at ${config.port}`, error);
    });
};

start();

server.setErrorHandler(errorHandler);
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

export default server;
