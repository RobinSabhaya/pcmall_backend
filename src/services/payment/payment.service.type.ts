import Stripe from 'stripe';

import { IOrder } from '@/models/orders';
import { IUser, IUserProfile } from '@/models/user';

export interface IUpdateAllCartStatusFilter {
  cartIds: Array<string>;
}

export interface IUpdateAllCartStatusBody {}

export interface IOrderConfirmationNotification {
  userData: IUser;
  userProfileData: IUserProfile;
  order: IOrder;
}
export interface IUpdateStockInInventoryFilter {
  order: IOrder;
  eventType?: Stripe.Event['type'];
}
export interface IUpdateStockInInventoryBody {}
