import jwt from 'jsonwebtoken'
import moment, { Moment } from 'moment'
import httpStatus from 'http-status'
import { IToken, Token } from '../../models/auth/index'
import ApiError from '../../utils/ApiError'
import { TOKEN_TYPES } from '../../helpers/constant.helper'
import { Schema } from 'mongoose'
import { IUser } from '@/models/user'
import { findOneAndUpdateDoc, findOneDoc, findOneAndDeleteDoc } from '@/helpers/mongoose.helper'
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper'
import { config } from '@/config/config'

const generateToken = (userId: Schema.Types.ObjectId, expires: Moment, type: TOKEN_TYPES, secret = config.jwt.secret): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, config.jwt.secret!);
};

const saveToken = async (token: string, userId: Schema.Types.ObjectId, expires: Moment, type: TOKEN_TYPES, options: object): Promise<IToken | null> => {
  const tokenDoc = await findOneAndUpdateDoc<IToken>(MONGOOSE_MODELS.TOKEN,
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
  return tokenDoc;
};


const verifyToken = async (token: string, type: TOKEN_TYPES): Promise<IToken> => {
  const payload = jwt.verify(token, config.jwt.secret!);
  const tokenDoc = await findOneDoc<IToken>(MONGOOSE_MODELS.TOKEN, { token, type, user: payload.sub, blacklisted: false });
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
const generateAuthTokens = async (user: IUser): Promise<{
  access: {
    token: string;
    expires: Date;
  },
  refresh: {
    token: string;
    expires: Date;
  }
}> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user._id, accessTokenExpires, TOKEN_TYPES.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH);
  const refreshTokenData = await saveToken(refreshToken, user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH, {
    upsert: true,
    new: true,
  });

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
const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await findOneDoc<IUser>(MONGOOSE_MODELS.USER, { email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, TOKEN_TYPES.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, TOKEN_TYPES.RESET_PASSWORD, {
    upsert: true,
    new: true,
  });
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: IUser): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, TOKEN_TYPES.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, TOKEN_TYPES.VERIFY_EMAIL, {
    upsert: true,
    new: true,
  });
  return verifyEmailToken;
};

const saveDeviceInfo = async (filter: object, payload: object, options = {}): Promise<IToken | null> => {
  return findOneAndUpdateDoc<IToken>(MONGOOSE_MODELS.TOKEN, filter, payload, options);
};


const deleteToken = async (filter: object): Promise<IToken | null> => {
  return findOneAndDeleteDoc<IToken>(MONGOOSE_MODELS.TOKEN, filter);
};

export {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  saveDeviceInfo,
  deleteToken,
};
