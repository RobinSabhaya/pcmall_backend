import { Address } from './schema/address.schema';

export interface ICreateUpdateAddress {
  message: string;
  addressData: Address | null;
}

export interface ICreateUpdateAddressResponse {
  success: boolean;
  message: string;
  data: {
    addressData: Address | null;
  };
}

export interface IDeleteAddress {
  message: string;
  addressData: Address | null;
}

export interface IDeleteAddressResponse {
  success: boolean;
  message: string;
  data: {
    addressData: Address | null;
  };
}
