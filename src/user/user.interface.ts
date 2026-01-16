import { UserProfile } from './schema/user-profile.schema';
import { User } from './schema/user.schema';

export interface IUpdateUserResponse {
  success: boolean;
  message: string;
  data: {
    userData: UserProfile | null;
  };
}

export interface IUpdateUser {
  message: string;
  userData: UserProfile | null;
}

export interface IUserDetailsResponse {
  success: boolean;
  data: {
    userData: User[] | null;
  };
}

export type IUserDetails = User[];

export interface IUserM extends User {
  user_profile: {
    profile_picture: string | null;
  };
}
