import {
  AccountStatus,
  AuthProvider,
  UserRole,
} from '../../src/user/enums/user.enum';

export const mockUser = {
  email: 'test@gmail.com',
  phone_number: '1234567891',
  password: 'HASH_PASSWORD',
  is_verified: true,
  account_status: AccountStatus.ACTIVE,
  roles: [UserRole.BUYER],
  auth_provider: AuthProvider.EMAIL,
  is_active: true,
};
