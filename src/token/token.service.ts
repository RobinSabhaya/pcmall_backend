import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { Dayjs } from 'dayjs';
import { Model, Types } from 'mongoose';

import configuration from '../config/configuration';
import { User } from '../user/schema/user.schema';

import { TokenTypes } from './enums/token-enum';
import { Token } from './schema/token.schema';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
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
    const accessTokenExpires = dayjs().add(
      +configuration().jwt.accessExpirationMinutes!,
      'minutes',
    );
    const accessToken = await this.generateToken(
      user._id,
      accessTokenExpires,
      TokenTypes.ACCESS,
    );

    const refreshTokenExpires = dayjs().add(
      +configuration().jwt.refreshExpirationDays!,
      'days',
    );
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
      secret: configuration().jwt.secret,
    });
  }

  async saveToken(
    token: string,
    userId: Types.ObjectId,
    expires: Dayjs,
    type: TokenTypes,
    options: object,
  ): Promise<Token | null> {
    return this.tokenModel.findOneAndUpdate(
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
      secret: configuration().jwt.secret,
    });
    const tokenDoc = await this.tokenModel.findOne({
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
