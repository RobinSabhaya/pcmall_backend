// const validate = require('../../../middlewares/validate');
// const authValidation = require('../../../validations/auth.validation');
import { forgotPassword, login, logout, refreshTokens, register, resetPassword, sendVerificationEmail, verifyEmail } from '../../../controllers/auth/auth.controller';
import { FastifyInstance } from 'fastify';

export default async function authRoute(fastify: FastifyInstance) {
    fastify.post('/register', register);
    fastify.post('/login', login);
    fastify.post('/logout', logout);
    fastify.post('/refresh-tokens', refreshTokens);
    fastify.post('/forgot-password', forgotPassword);
    fastify.post('/reset-password', resetPassword);
    fastify.post('/send-verification-email', sendVerificationEmail);
    fastify.post('/verify-email', verifyEmail);
}