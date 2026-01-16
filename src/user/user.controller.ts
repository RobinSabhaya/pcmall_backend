import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import { UpdateUserDto } from './dto/user.dto';
import { User } from './schema/user.schema';
import { IUpdateUserResponse, IUserDetailsResponse } from './user.interface';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('update')
  async UpdateUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUpdateUserResponse> {
    const { userData, message } = await this.userService.updateUser(
      updateUserDto,
      {
        user,
      },
    );

    return {
      success: true,
      message,
      data: { userData: userData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('details')
  async getUserDetails(
    @CurrentUser() user: User,
  ): Promise<IUserDetailsResponse> {
    const userData = await this.userService.getUser({
      user,
    });

    return {
      success: true,
      data: { userData: userData ?? null },
    };
  }
}
