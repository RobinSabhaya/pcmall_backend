import { FastifyInstance } from 'fastify';

import { createBaseRoute } from '@/utils/baseRoute';
import * as authValidation from '@/validations/auth.validation';

import {
  login,
  logout,
  refreshTokens,
  register,
  signup,
} from '../../../controllers/auth/auth.controller';

export default function authRoute(fastify: FastifyInstance): void {
  const route = createBaseRoute(fastify);
  route({
    method: 'POST',
    url: '/register',
    schema: authValidation.register,
    description: 'Register a new user',
    tags: ['Authentication'],
    handler: register,
  });
  route({
    method: 'POST',
    url: '/signup',
    schema: authValidation.signup,
    description: 'Sign up a new user',
    tags: ['Authentication'],
    handler: signup,
  });
  route({
    method: 'POST',
    url: '/login',
    schema: authValidation.login,
    description: 'Login a user',
    tags: ['Authentication'],
    handler: login,
  });
  route({
    method: 'POST',
    url: '/logout',
    description: 'Logout a user',
    tags: ['Authentication'],
    handler: logout,
  });
  route({
    method: 'POST',
    url: '/refresh-tokens',
    description: 'Refresh authentication tokens',
    tags: ['Authentication'],
    handler: refreshTokens,
  });
}
