// const validate = require('../../../middlewares/validate');
// const authValidation = require('../../../validations/auth.validation');
import { createBaseRoute } from '@/utils/baseRoute';
import {
  forgotPassword,
  login,
  logout,
  refreshTokens,
  register,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from '../../../controllers/auth/auth.controller';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
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
