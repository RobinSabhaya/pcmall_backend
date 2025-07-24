import { deleteToken, generateAuthTokens, verifyToken } from './token.service';
import { Token } from '@/models/auth';
import ApiError from '@/utils/ApiError';
import { TOKEN_TYPES } from '@/helpers/constant.helper';
import { IUser } from '@/models/user';
import { findOneAndUpdateDoc, findOneDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';

export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<IUser | null> => {
  const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { email });
  // if (!user || !(await user?.isPasswordMatch(password))) {
  //   throw new ApiError(401, 'Incorrect email or password');
  // }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: TOKEN_TYPES.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(404, 'Not found');
  }
  await deleteToken({ _id: refreshTokenDoc._id });
};

export const refreshAuth = async (refreshToken: string): Promise<unknown> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
    const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { _id: refreshTokenDoc?.user });
    if (!user) {
      throw new Error();
    }
    await deleteToken({ _id: refreshTokenDoc?._id });
    return generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(401, 'Please authenticate');
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
  newPassword: string,
): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, TOKEN_TYPES.RESET_PASSWORD);
    const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, {
      _id: resetPasswordTokenDoc?.user,
    });
    if (!user) {
      throw new Error();
    }
    await findOneAndUpdateDoc<IUser>(
      MONGOOSE_MODELS.USER,
      { _id: user?.id },
      { password: newPassword },
    );
    await Token.deleteMany({ user: user?.id, type: TOKEN_TYPES.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(401, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, TOKEN_TYPES.VERIFY_EMAIL);
    const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { _id: verifyEmailTokenDoc?.user });
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user?.id, type: TOKEN_TYPES.VERIFY_EMAIL });
    await findOneAndUpdateDoc<IUser>(
      MONGOOSE_MODELS.USER,
      { _id: user?.id },
      { isEmailVerified: true },
    );
  } catch (error) {
    throw new ApiError(401, 'Email verification failed');
  }
};
