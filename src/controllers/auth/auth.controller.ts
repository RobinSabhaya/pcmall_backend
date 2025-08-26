import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

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

import {
  createDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '../../helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '../../helpers/mongoose.model.helper';
import * as authService from '../../services/auth/auth.service';
import {
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
} from '../../services/auth/token.service';
import ApiError from '../../utils/apiErrorHandler';

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { first_name, email, password, confirm_password } =
      request.body as RegisterSchema;

    // Match password and confirm password
    if (password.localeCompare(confirm_password))
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

    let user: Partial<IUser | null> = await findOneDoc<IUser>(
      MONGOOSE_MODELS.USER,
      { email }
    );

    if (user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken.');
    }

    if (password.localeCompare(confirm_password))
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

    // Create User
    user = await createDoc<IUser>(
      MONGOOSE_MODELS.USER,
      request.body as RegisterSchema
    );

    // set profile details
    await findOneAndUpdateDoc(
      MONGOOSE_MODELS.USER_PROFILE,
      {
        user: user._id,
        first_name,
      },
      {
        user: user._id,
        first_name,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return reply.code(httpStatus.CREATED).send({
      success: true,
      message: 'User register successfully',
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

    return reply.code(httpStatus.CREATED).send({
      success: true,
      message: 'User signup successfully',
      data: { user, tokens },
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
  const { email } = request.body as LoginSchema;
  try {
    const user = await authService.loginUserWithEmailAndPassword(
      email
      // password
    );

    // generate tokens
    const tokens = await generateAuthTokens(user!);

    // if (device_info) {
    //   // generate device info
    //   const device_info = parseDeviceInfo(device_info);

    //   // save device info
    //   await tokenService.saveDeviceInfo(
    //     {
    //       _id: tokens.refresh._id,
    //     },
    //     { device_info }
    //   );
    // }

    return reply.code(httpStatus.OK).send({
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

    return reply.code(httpStatus.OK).send({
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
    return reply.code(httpStatus.OK).send({ data: { ...(tokens as object) } });
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
