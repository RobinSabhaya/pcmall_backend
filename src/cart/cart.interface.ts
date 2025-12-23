import { Cart } from './schema/cart.schema';

export interface ICreateCart {
  cartData: Cart | null;
  message: string;
}

export interface IUpdateCart {
  cartData: Cart | null;
  message: string;
}

export interface IRemoveCart {
  cartData: Cart | null;
  message: string;
}

export interface IGetAllCart {
  cartData: Cart[];
  totalQty: number;
}

export interface IAddToCartResponse {
  success: boolean;
  message: string;
  data: {
    cartData: Cart | null;
  };
}

export interface IUpdateCartResponse {
  success: boolean;
  message: string;
  data: {
    cartData: Cart | null;
  };
}

export interface IRemoveCartResponse {
  success: boolean;
  message: string;
  data: {
    cartData: Cart | null;
  };
}

export interface IGetAllCartResponse {
  success: boolean;
  data: {
    cartData: Cart[];
    totalQty: number;
  };
}
