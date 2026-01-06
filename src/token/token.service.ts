import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { Dayjs } from 'dayjs';
import { Model, Types } from 'mongoose';

import {
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';
import { User } from '../user/schema/user.schema';

import { TokenTypes } from './enums/token-enum';
import { Token } from './schema/token.schema';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async generateAuthTokens(user: User): Promise<{
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  }> {
    const accessExpires = this.configService.get('jwt.accessExpirationMinutes');
    const accessTokenExpires = dayjs().add(accessExpires, 'minutes');
    const accessToken = await this.generateToken(
      user._id,
      accessTokenExpires,
      TokenTypes.ACCESS,
    );

    const refreshExpires = this.configService.get('jwt.refreshExpirationDays');
    const refreshTokenExpires = dayjs().add(refreshExpires, 'days');
    const refreshToken = await this.generateToken(
      user._id,
      refreshTokenExpires,
      TokenTypes.REFRESH,
    );

    await this.saveToken(
      refreshToken,
      user._id,
      refreshTokenExpires,
      TokenTypes.REFRESH,
      {
        upsert: true,
        new: true,
      },
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate().toDateString(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate().toDateString(),
      },
    };
  }

  async generateToken(
    userId: Types.ObjectId,
    expires: Dayjs,
    type: TokenTypes,
  ): Promise<string> {
    const payload = {
      sub: userId,
      iat: dayjs().unix(),
      exp: expires.unix(),
      type,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
    });
  }

  async saveToken(
    token: string,
    userId: Types.ObjectId,
    expires: Dayjs,
    type: TokenTypes,
    options: object,
  ): Promise<Token | null> {
    return findOneAndUpdateDoc(
      this.tokenModel,
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
      options,
    );
  }

  async verifyToken(token: string, type: TokenTypes): Promise<Token | null> {
    const payload: {
      sub: string;
    } = await this.jwtService.verify(token, {
      secret: this.configService.get('jwt.secret'),
    });
    const tokenDoc = await findOneDoc(this.tokenModel, {
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new NotFoundException('Token not found');
    }
    return tokenDoc;
  }
}
