import { createBaseRoute } from '@/utils/baseRoute';
import {
  login,
  logout,
  refreshTokens,
  register,
  signup
} from '../../../controllers/auth/auth.controller';
import { FastifyInstance} from 'fastify';
import * as authValidation from '@/validations/auth.validation';

export default async function authRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);
  route({
    method: 'POST',
    url: '/register',
    schema: authValidation.register,
    handler: register,
  });
  route({
    method: 'POST',
    url: '/signup',
    schema: authValidation.signup,
    handler: signup,
  });
  route({
    method: 'POST',
    url: '/login',
    schema: authValidation.login,
    handler: login,
  });
  route({
    method: 'POST',
    url: '/logout',
    schema: authValidation.logout,
    handler: logout,
  });
  route({
    method: 'POST',
    url: '/refresh-tokens',
    schema: authValidation.refreshTokens,
    handler: refreshTokens,
  });
  // route.post('/forgot-password', forgotPassword);
  // route.post('/reset-password', resetPassword);
  // route.post('/send-verification-email', sendVerificationEmail);
  // route.post('/verify-email', verifyEmail);
}
