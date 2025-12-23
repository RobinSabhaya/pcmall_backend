import { User } from '../user/schema/user.schema';

export interface ITokenResponse {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface ILogin {
  message: string;
  user: User | null;
  tokens: ITokenResponse | undefined;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User | null;
    tokens: ITokenResponse | undefined;
  };
}

export interface IRegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User | null;
  };
}

export interface IRegister {
  message: string;
  user: User | null;
}

export interface ISignupResponse {
  message: string;
  user: User | null;
  tokens: ITokenResponse | undefined;
}
