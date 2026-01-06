import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { FastifyReply } from 'fastify';

import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

import { ILogin, IRegister, ISignupResponse } from './auth.interface';
import { LoginDto, RegisterDto, SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IRegister> {
    const { first_name, email, password, confirm_password } = registerDto;
    const salt = 10;

    // Match password and confirm password
    if (password.localeCompare(confirm_password))
      throw new UnauthorizedException(
        `Password and Confirm password doesn't match`,
      );

    let user = await this.userService.findOne({ email });

    if (user) {
      throw new ConflictException('Email is already taken.');
    }

    const hashPassword = await bcrypt.hash(password, salt);

    // Create User
    user = await this.userService.create({
      ...registerDto,
      password: hashPassword,
    });

    // set profile details
    if (user)
      await this.userService.createUpdateUserProfile(
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

    const message = 'User register successfully';

    return {
      message,
      user,
    };
  }

  async signup(
    signupDto: SignupDto,
    reply: FastifyReply,
  ): Promise<ISignupResponse> {
    const { first_name, email, password, confirm_password } = signupDto;
    let tokens;
    const env = this.configService.get('env');
    const domain = this.configService.get('client.baseAppDomain');

    // Match password and confirm password
    if (password.localeCompare(confirm_password))
      throw new BadRequestException('Invalid credentials.');

    let user = await this.userService.findOne({
      email,
    });

    if (user) {
      throw new ConflictException('Email is already taken.');
    }

    // Create User
    user = await this.userService.create(signupDto);

    // set profile details
    if (user) {
      await this.userService.createUpdateUserProfile(
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
      tokens = await this.tokenService.generateAuthTokens(user);
    }

    if (tokens)
      reply
        .setCookie('t', tokens.access.token, {
          path: '/',
          httpOnly: true,
          secure: env === 'production',
          sameSite: env === 'production' ? 'none' : 'lax',
          ...(env === 'production' && {
            domain,
          }),
        })
        .setCookie('rt', tokens.refresh.token, {
          path: '/',
          httpOnly: true,
          secure: env === 'production',
          sameSite: env === 'production' ? 'none' : 'lax',
          ...(env === 'production' && {
            domain,
          }),
        });

    return {
      message: 'User signup successfully',
      user,
      tokens,
    };
  }

  async login(loginDto: LoginDto, reply: FastifyReply): Promise<ILogin> {
    const { email, password } = loginDto;
    let tokens;
    const env = this.configService.get('env');
    const domain = this.configService.get('client.baseAppDomain');

    const userData = await this.userService.findOne({
      email,
    });

    if (!userData) throw new BadRequestException('Incorrect email or password');

    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Incorrect email or password');
    }

    if (userData != null)
      // generate tokens
      tokens = await this.tokenService.generateAuthTokens(userData);

    if (tokens)
      reply
        .setCookie('t', tokens.access.token, {
          path: '/',
          httpOnly: true,
          secure: env === 'production',
          sameSite: env === 'production' ? 'none' : 'lax',
          ...(env === 'production' && {
            domain,
          }),
        })
        .setCookie('rt', tokens.refresh.token, {
          path: '/',
          httpOnly: true,
          secure: env === 'production',
          sameSite: env === 'production' ? 'none' : 'lax',
          ...(env === 'production' && {
            domain,
          }),
        });

    return {
      user: userData,
      tokens,
      message: 'User login successfully',
    };
  }
}
