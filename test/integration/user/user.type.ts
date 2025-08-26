import { IAddress, IUser } from '../../../src/models/user';
import { IUserM } from '../../../src/services/user/users.service.type';

export interface IUpdateUserResponse {
  data: IUser;
}

export interface IGetDetailsResponse {
  data: IUserM;
}

export interface IAddressUpdateResponse {
  data: IAddress;
}
