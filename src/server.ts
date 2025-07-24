import Fastify from 'fastify';
import app from './app';
import { config } from './config/config';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { errorHandler } from './utils/errorHandler';

const server = Fastify({ logger: false });

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

app(server)
  .then(() => {
    server.listen({ port: +config.port! || 3000 });
  })
  .catch((err) => {
    server.log.error(err);
    process.exit(1);
  });

server.setErrorHandler(errorHandler);
