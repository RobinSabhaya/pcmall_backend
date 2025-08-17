import httpStatus from 'http-status';

import { TOKENTYPES } from '@/helpers/constant.helper';
import {
  createDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { token } from '@/models/auth';
import { IUser, IUserProfile } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';
import { SignupSchema } from '@/validations/auth.validation';

import { deleteToken, generateAuthTokens, verifyToken } from './token.service';
import { ITokenResponse } from './token.service.type';

export const loginUserWithEmailAndPassword = async (
  email: string
  // password: string
): Promise<IUser | null> => {
  // if (!user || !(await user?.isPasswordMatch(password))) {
  //   throw new ApiError(401, 'Incorrect email or password');
  // }
  return findOneDoc<IUser>(MONGOOSE_MODELS.USER, { email });
};

export const signup = async (
  payload: SignupSchema
): Promise<{
  user: IUser;
  tokens: ITokenResponse;
}> => {
  const { first_name, email, password, confirm_password } =
    payload as SignupSchema;

  // Match password and confirm password
  if (password.localeCompare(confirm_password))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

  let user: IUser | null = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
    email,
  });

  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken.');
  }

  // Create User
  user = await createDoc<IUser>(MONGOOSE_MODELS.USER, payload);

  // set profile details
  await findOneAndUpdateDoc<IUserProfile>(
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

  // generate tokens
  const tokens = await generateAuthTokens(user as IUser);

  return {
    user,
    tokens,
  };
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await token.findOne({
    token: refreshToken,
    type: TOKENTYPES.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await deleteToken({ _id: refreshTokenDoc._id });
};

export const refreshAuth = async (refreshToken: string): Promise<unknown> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, TOKENTYPES.REFRESH);
    const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
      _id: refreshTokenDoc?.user,
    });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await deleteToken({ _id: refreshTokenDoc?._id });
    return generateAuthTokens(user);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param string resetPasswordToken
 * @param string newPassword
 * @returns {Promise}
 */
export const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(
      resetPasswordToken,
      TOKENTYPES.RESET_PASSWORD
    );
    const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
      _id: resetPasswordTokenDoc?.user,
    });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await findOneAndUpdateDoc<IUser>(
      MONGOOSE_MODELS.USER,
      { _id: user?.id },
      { password: newPassword }
    );
    await token.deleteMany({ user: user?.id, type: TOKENTYPES.RESET_PASSWORD });
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(
      verifyEmailToken,
      TOKENTYPES.VERIFY_EMAIL
    );
    const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
      _id: verifyEmailTokenDoc?.user,
    });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await token.deleteMany({ user: user?.id, type: TOKENTYPES.VERIFY_EMAIL });
    await findOneAndUpdateDoc<IUser>(
      MONGOOSE_MODELS.USER,
      { _id: user?.id },
      { isEmailVerified: true }
    );
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
