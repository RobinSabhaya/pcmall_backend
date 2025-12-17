import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { TokenService } from '../token/token.service';
import { UserProfile } from '../user/schema/user-profile.schema';
import { User } from '../user/schema/user.schema';

import { ILogin, IRegister, ISignupResponse } from './auth.interface';
import { LoginDto, RegisterDto, SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfile>,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IRegister> {
    const { first_name, email, password, confirm_password } = registerDto;
    const salt = 10;

    // Match password and confirm password
    if (password.localeCompare(confirm_password))
      throw new UnauthorizedException(
        `Password and Confirm password doesn't match`,
      );

    let user: User | null = await this.userModel.findOne({ email });

    if (user) {
      throw new ConflictException('Email is already taken.');
    }

    const hashPassword = await bcrypt.hash(password, salt);

    // Create User
    user = await this.userModel.create({
      ...registerDto,
      password: hashPassword,
    });

    // set profile details
    await this.userProfileModel.findOneAndUpdate(
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

  async signup(signupDto: SignupDto): Promise<ISignupResponse> {
    const { first_name, email, password, confirm_password } = signupDto;

    // Match password and confirm password
    if (password.localeCompare(confirm_password))
      throw new BadRequestException('Invalid credentials.');

    let user = await this.userModel.findOne({
      email,
    });

    if (user) {
      throw new ConflictException('Email is already taken.');
    }

    // Create User
    user = await this.userModel.create(signupDto);

    // set profile details
    await this.userProfileModel.findOneAndUpdate(
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
    const tokens = await this.tokenService.generateAuthTokens(user);

    return {
      message: 'User signup successfully',
      user,
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<ILogin> {
    const { email, password } = loginDto;
    let tokens;
    const userData = await this.userModel.findOne({
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

    return {
      user: userData,
      tokens,
      message: 'User login successfully',
    };
  }
}
