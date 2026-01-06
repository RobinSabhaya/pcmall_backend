import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import configuration from './config/configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Cookie
  // TODO: need to check with config service
  await app.register(fastifyCookie, {
    secret: configuration().cookie.cookieSecret,
  });

  // Helmet
  await app.register(helmet);

  // CSRF
  await app.register(fastifyCsrf);

  // API Version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://pcmall-web.vercel.app',
      'http://localhost:5000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('PCMall')
    .setDescription('The PCMall API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap();
