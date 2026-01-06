import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { mockTokenService } from '../../test/mocks/token.service.mock';
import { mockUserService } from '../../test/mocks/user.service.mock';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('define all required method', () => {
    expect(service.register).toBeDefined();
    expect(service.login).toBeDefined();
    expect(service.signup).toBeDefined();
  });
});
