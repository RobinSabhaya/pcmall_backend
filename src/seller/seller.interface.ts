import { Seller } from './schema/seller.schema';

export interface ICreateUpdateSellerResponse {
  success: boolean;
  message: string;
  data: {
    sellerData: Seller | null;
  };
}

export interface ICreateUpdateSeller {
  message: string;
  sellerData: Seller | null | undefined;
}

export interface IDeleteSellerResponse {
  success: boolean;
  message: string;
  data: {
    sellerData: Seller | null;
  };
}
export interface IDeleteSeller {
  message: string;
  sellerData: Seller | null;
}

export interface IGetAllSellersResponse {
  success: boolean;
  data: {
    sellerData: Seller[];
  };
}

export interface IGetAllSellers {
  sellerData: Seller[];
}
