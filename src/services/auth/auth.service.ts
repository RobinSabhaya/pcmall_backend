import { deleteToken, generateAuthTokens, verifyToken } from './token.service';
import { Token } from '@/models/auth';
import ApiError from '@/utils/ApiError';
import { TOKEN_TYPES } from '@/helpers/constant.helper';
import { IUser, IUserProfile } from '@/models/user';
import { createDoc, findOneAndUpdateDoc, findOneDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { SignupSchema } from '@/validations/auth.validation';
import httpStatus from 'http-status'

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

export const signup = async (payload: SignupSchema) => { 
    const { first_name, email, password, confirm_password } = payload as SignupSchema;

      // Match password and confirm password
    if (password != confirm_password)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

    let user: Partial<IUser | null> = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { email });

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
      },
    );

  // generate tokens
  const tokens = await generateAuthTokens(user as IUser);
  
  return {
    user, 
    tokens
  }
}

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
