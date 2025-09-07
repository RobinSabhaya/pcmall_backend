import { ISeller } from '../../../src/models/user';

export interface ICreateUpdateSellerResponse {
  data: { sellerData: ISeller };
}

export interface IDeleteSellerResponse {
  data: { sellerData: ISeller };
}

export interface IGetAllSellersResponse {
  data: { sellerData: ISeller[] };
}
