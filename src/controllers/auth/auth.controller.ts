import { FastifyReply, FastifyRequest } from 'fastify';
import { status as httpStatus } from 'http-status';

import { IUser } from '@/models/user';
import {
  ForgotPasswordSchema,
  LoginSchema,
  RefreshTokensSchema,
  RegisterSchema,
  ResetPasswordSchema,
  SignupSchema,
  VerifyEmailSchema,
} from '@/validations/auth.validation';

import { config } from '../../config/config';
import * as authService from '../../services/auth/auth.service';
import {
  generateResetPasswordToken,
  generateVerifyEmailToken,
} from '../../services/auth/token.service';
import { ITokenResponse } from '../../services/auth/token.service.type';
import ApiError from '../../utils/apiErrorHandler';
import { toDeepObject } from '../../utils/custom.util';

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { user, message } = await authService.registerWithEmailAndPassword(
      request.body as RegisterSchema
    );

    return reply.code(httpStatus.CREATED).send({
      success: true,
      message,
      data: { user },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const signup = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { user, tokens } = await authService.signup(
      request.body as SignupSchema
    );

    return reply
      .setCookie('t', tokens.access.token, {
        path: '/',
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: config.env === 'production' ? 'none' : 'lax',
        domain: config.client.baseAppDomain,
      })
      .code(httpStatus.CREATED)
      .send({
        success: true,
        message: 'User signup successfully',
        data: {
          user: toDeepObject(user) as IUser,
          tokens: toDeepObject(tokens) as ITokenResponse,
        },
      });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const login = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { tokens } = await authService.loginUserWithEmailAndPassword(
      request.body as LoginSchema
    );

    return reply
      .setCookie('t', tokens.access.token, {
        path: '/',
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: config.env === 'production' ? 'none' : 'lax',
        domain: config.client.baseAppDomain,
      })
      .code(httpStatus.OK)
      .send({
        success: true,
        data: { tokens },
        message: 'User login successfully',
      });
  } catch (error: unknown) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const logout = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { refreshToken } = request.body as RefreshTokensSchema;
    await authService.logout(refreshToken);

    return reply.clearCookie('t').code(httpStatus.OK).send({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error: unknown) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const refreshTokens = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { refreshToken } = request.body as RefreshTokensSchema;
    const tokens = await authService.refreshAuth(refreshToken);
    return reply.code(httpStatus.OK).send({
      success: true,
      data: { tokens: toDeepObject(tokens) as ITokenResponse },
    });
  } catch (error: unknown) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};

export const forgotPassword = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const { email } = request.body as ForgotPasswordSchema;
  await generateResetPasswordToken(email);
  // await sendResetPasswordEmail(email, resetPasswordToken);
  return reply.code(httpStatus.NO_CONTENT).send();
};

export const resetPassword = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const { token } = request.query as ResetPasswordSchema;
  const { password } = request.body as ResetPasswordSchema;
  await authService.resetPassword(token, password);
  return reply.code(httpStatus.NO_CONTENT).send();
};

export const sendVerificationEmail = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const user = request.user as IUser;
  await generateVerifyEmailToken(user);
  // await sendVerificationEmail(user?.email!, verifyEmailToken);
  return reply.code(httpStatus.NO_CONTENT).send();
};

export const verifyEmail = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const { token } = request.query as VerifyEmailSchema;
  await authService.verifyEmail(token);
  return reply.code(httpStatus.NO_CONTENT).send();
};
