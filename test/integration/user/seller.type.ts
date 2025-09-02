import { ISeller } from '../../../src/models/user';

export interface ICreateUpdateSellerResponse {
  data: ISeller;
}

export interface IDeleteSellerResponse {
  data: ISeller;
}

export interface IGetAllSellersResponse {
  data: ISeller[];
}
