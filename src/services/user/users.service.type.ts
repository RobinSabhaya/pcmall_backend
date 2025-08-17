import { IUser } from '../../models/user';

export interface IUserM extends IUser {
  user_profile: {
    profile_picture: string | null;
  };
}
