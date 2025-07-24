import { INVENTORY_TYPE } from '@/helpers/constant.helper';
import { IOrder } from '@/models/orders';
import { IUser, IUserProfile } from '@/models/user';
import Stripe from 'stripe';

export interface UpdateAllCartStatusFilter {
  cartIds: Array<string>;
}

export interface UpdateAllCartStatusBody {}

export interface OrderConfirmationNotification {
  userData: IUser;
  userProfileData: IUserProfile;
  order: IOrder;
}
export interface UpdateStockInInventoryFilter {
  order: IOrder;
  eventType?: Stripe.Event['type'];
}
export interface UpdateStockInInventoryBody {}
