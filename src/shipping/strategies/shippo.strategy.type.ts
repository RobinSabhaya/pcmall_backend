import { DistanceUnitType, MassUnitType } from '../enums/shipping.enum';

export interface IAddress {
  name?: string;
  street1?: string;
  city?: string;
  state?: string;
  country: string;
  zip: string;
  phone: string;
  email: string;
}

export interface IParcel {
  massUnit: MassUnitType;
  weight: string;
  distanceUnit: DistanceUnitType;
  height: string;
  length: string;
  width: string;
}

export interface ICreateShipping {
  addressFrom: IAddress;
  addressTo: IAddress;
  parcel: IParcel;
}
