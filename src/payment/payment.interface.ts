import { Payment } from './schema/payment.schema';

export interface ICreateCheckout {
  message: string;
  checkoutUrl: string | null | undefined;
}
export interface ICreateCheckoutResponse {
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string | null | undefined;
  };
}

export interface ICheckoutItem {
  quantity: number;
  product_name: string;
  unit_amount: number;
  productVariantId: string;
}

export interface ICalculateCostPayload {
  items: ICheckoutItem[];
  currency: string;
}

export interface ICheckoutItemData {
  variant: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ICheckoutItemResponse {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
}

export interface ICalculateCostResponse {
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  lineItems: ICheckoutItemResponse[];
  itemsData: ICheckoutItemData[];
}

export interface ICreateRefund {
  paymentData: Payment | null;
  message: string;
}

export interface ICreateRefundResponse {
  success: boolean;
  message: string;
  data: {
    paymentData: Payment | null;
  };
}
