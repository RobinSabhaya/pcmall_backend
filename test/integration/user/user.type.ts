import { IAddress, IUser } from '../../../src/models/user';
import { IUserM } from '../../../src/services/user/users.service.type';

export interface IUpdateUserResponse {
  data: { userData: IUser };
}

export interface IGetDetailsResponse {
  data: { userData: IUserM };
}

export interface IAddressUpdateResponse {
  data: { addressData: IAddress };
}
