import { Order } from './schema/order.schema';

export type IGetAllOrders = Order[];

export interface IGetAllOrdersResponse {
  success: boolean;
  data: {
    ordersData: Order;
  };
}
