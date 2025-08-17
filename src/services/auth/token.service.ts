import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import { Schema } from 'mongoose';

import { config } from '@/config/config';
import {
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IUser } from '@/models/user';

import { TOKENTYPES } from '../../helpers/constant.helper';
import { IToken } from '../../models/auth/index';
import ApiError from '../../utils/apiErrorHandler';

export const generateToken = (
  userId: Schema.Types.ObjectId,
  expires: Moment,
  type: TOKENTYPES
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, config.jwt.secret!);
};

export const saveToken = async (
  token: string,
  userId: Schema.Types.ObjectId,
  expires: Moment,
  type: TOKENTYPES,
  options: object
): Promise<IToken | null> => {
  return findOneAndUpdateDoc<IToken>(
    MONGOOSE_MODELS.TOKEN,
    {
      type,
      user: userId,
    },
    {
      type,
      user: userId,
      token,
      expires: expires.toDate(),
      blacklisted: false,
    },
    options
  );
};

export const verifyToken = async (
  token: string,
  type: TOKENTYPES
): Promise<IToken> => {
  const payload = jwt.verify(token, config.jwt.secret!);
  const tokenDoc = await findOneDoc<IToken>(MONGOOSE_MODELS.TOKEN, {
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (
  user: IUser
): Promise<{
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}> => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );
  const accessToken = generateToken(
    user._id,
    accessTokenExpires,
    TOKENTYPES.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days'
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    TOKENTYPES.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    TOKENTYPES.REFRESH,
    {
      upsert: true,
      new: true,
    }
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (
  email: string
): Promise<string> => {
  const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    'minutes'
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    TOKENTYPES.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    TOKENTYPES.RESET_PASSWORD,
    {
      upsert: true,
      new: true,
    }
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (
  user: IUser
): Promise<string> => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    'minutes'
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    TOKENTYPES.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, TOKENTYPES.VERIFY_EMAIL, {
    upsert: true,
    new: true,
  });
  return verifyEmailToken;
};

export const saveDeviceInfo = async (
  filter: object,
  payload: object,
  options = {}
): Promise<IToken | null> => {
  return findOneAndUpdateDoc<IToken>(
    MONGOOSE_MODELS.TOKEN,
    filter,
    payload,
    options
  );
};

export const deleteToken = async (filter: object): Promise<IToken | null> => {
  return findOneAndDeleteDoc<IToken>(MONGOOSE_MODELS.TOKEN, filter);
};
