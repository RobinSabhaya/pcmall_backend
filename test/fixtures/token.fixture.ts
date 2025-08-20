import moment from 'moment';

import { config } from '../../src/config/config';
import { TOKENTYPES } from '../../src/helpers/constant.helper';
import * as tokenService from '../../src/services/auth/token.service';

import { userOne, admin } from './user.fixture';

const accessTokenExpires = moment().add(
  config.jwt.accessExpirationMinutes,
  'minutes'
);

export const userOneAccessToken = tokenService.generateToken(
  userOne._id,
  accessTokenExpires,
  TOKENTYPES.ACCESS
);

export const adminAccessToken = tokenService.generateToken(
  admin._id,
  accessTokenExpires,
  TOKENTYPES.ACCESS
);
