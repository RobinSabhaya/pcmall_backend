import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';

import configuration from '../config/configuration';

import { Public } from './auth.decorator';
import { ILoginResponse, IRegisterResponse } from './auth.interface';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<IRegisterResponse> {
    const { message, user } = await this.authService.register(registerDto);

    return {
      success: true,
      message,
      data: {
        user,
      },
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(
    @Body() signupDto: RegisterDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<IRegisterResponse> {
    const { tokens, message, user } = await this.authService.signup(signupDto);

    reply
      .setCookie('t', tokens.access.token, {
        path: '/',
        httpOnly: true,
        secure: configuration().env === 'production',
        sameSite: configuration().env === 'production' ? 'none' : 'lax',
        ...(configuration().env === 'production' && {
          domain: configuration().client.baseAppDomain,
        }),
      })
      .setCookie('rt', tokens.refresh.token, {
        path: '/',
        httpOnly: true,
        secure: configuration().env === 'production',
        sameSite: configuration().env === 'production' ? 'none' : 'lax',
        ...(configuration().env === 'production' && {
          domain: configuration().client.baseAppDomain,
        }),
      });

    return {
      success: true,
      message,
      data: {
        user,
      },
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<ILoginResponse> {
    const { tokens, message, user } = await this.authService.login(loginDto);

    if (tokens)
      reply
        .setCookie('t', tokens.access.token, {
          path: '/',
          httpOnly: true,
          secure: configuration().env === 'production',
          sameSite: configuration().env === 'production' ? 'none' : 'lax',
          ...(configuration().env === 'production' && {
            domain: configuration().client.baseAppDomain,
          }),
        })
        .setCookie('rt', tokens.refresh.token, {
          path: '/',
          httpOnly: true,
          secure: configuration().env === 'production',
          sameSite: configuration().env === 'production' ? 'none' : 'lax',
          ...(configuration().env === 'production' && {
            domain: configuration().client.baseAppDomain,
          }),
        });

    return {
      success: true,
      message,
      data: {
        user,
        tokens,
      },
    };
  }
}
