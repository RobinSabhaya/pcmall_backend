import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import configuration from '../config/configuration';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: configuration().jwt.secret,
    }),
    UserModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
