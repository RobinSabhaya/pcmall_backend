import { FastifyInstance } from 'fastify';

import * as fileController from '@/controllers/file/file.controller';
import * as fileValidation from '@/validations/file.validation';

import { createBaseRoute } from '../../../utils/baseRoute';

export default function fileRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);

  route({
    method: 'POST',
    url: '/generate-url',
    schema: fileValidation.generateFileUpload,
    description: 'Generate file upload URL',
    tags: ['Generate file upload URL'],
    handler: fileController.generateFileUploadURL,
  });
}
