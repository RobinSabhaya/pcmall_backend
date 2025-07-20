import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from 'http-status';
import * as authService from '../../services/auth/auth.service';
import * as userService from '../../services/user/user.service';
import { generateAuthTokens, generateResetPasswordToken, generateVerifyEmailToken } from '../../services/auth/token.service';
import { parseDeviceInfo } from '../../helpers/function.helper';
import { createDoc, findOneAndUpdateDoc, findOneDoc } from '../../helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '../../helpers/mongoose.model.helper';
import ApiError from '../../utils/ApiError';
import { ForgotPasswordSchema, LoginSchema, RefreshTokensSchema, RegisterSchema, Re, ResetPasswordSchema, VerifyEmailSchema } from "@/validations/auth.validation";
import { IUser} from "@/models/user";
import '@/models/user/user.model'

const register = async (req: FastifyRequest, reply: FastifyReply) => {
  const { first_name, email, password, confirm_password } = req.body as RegisterSchema;

  // Match password and confirm password
  if (password != confirm_password) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

  let user: Partial<IUser | null> = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { email });

  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken.');
  }

  if (password != confirm_password) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

  // Create User
  user = await createDoc<RegisterSchema>(MONGOOSE_MODELS.USER, req.body as RegisterSchema);

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
}

const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as LoginSchema;
  try {
    const user = await authService.loginUserWithEmailAndPassword(email, password);

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
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
}

const logout = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { refreshToken } = req.body as RefreshTokensSchema
    await authService.logout(refreshToken);

    return reply.code(httpStatus.OK).send({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
}

const refreshTokens = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { refreshToken } = request.body as RefreshTokensSchema;
    const tokens = await authService.refreshAuth(refreshToken);
    return reply.code(httpStatus.OK).send({ data: { ...tokens as object } });
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
}

const forgotPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email } = request.body as ForgotPasswordSchema;
  const resetPasswordToken = await generateResetPasswordToken(email);
  // await sendResetPasswordEmail(email, resetPasswordToken);
  return reply.code(httpStatus.NO_CONTENT).send();
}

const resetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  const { token } = request.query as ResetPasswordSchema;
  const { password } = request.body as ResetPasswordSchema;
  await authService.resetPassword(token, password);
  return reply.code(httpStatus.NO_CONTENT).send();
};

const sendVerificationEmail = async (request: FastifyRequest, reply: FastifyReply) => {
  const { user } = request as unknown;
  const verifyEmailToken = await generateVerifyEmailToken(user);
  await sendVerificationEmail(user.email, verifyEmailToken);
  return reply.code(httpStatus.NO_CONTENT).send();
};

const verifyEmail = async (request: FastifyRequest, reply: FastifyReply) => {
  const { token } = request.query as VerifyEmailSchema
  await authService.verifyEmail(token);
  return reply.code(httpStatus.NO_CONTENT).send();
};

export {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
