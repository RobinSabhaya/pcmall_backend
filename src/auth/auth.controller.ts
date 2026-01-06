import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';

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
        user: user ?? null,
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
    const { message, user } = await this.authService.signup(signupDto, reply);

    return {
      success: true,
      message,
      data: {
        user: user ?? null,
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
    const { tokens, message, user } = await this.authService.login(
      loginDto,
      reply,
    );

    return {
      success: true,
      message,
      data: {
        user: user ?? null,
        tokens: tokens ?? undefined,
      },
    };
  }
}
