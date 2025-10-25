import path from 'path';

import { status as httpStatus } from 'http-status';
import moment from 'moment';
import { FilterQuery, UpdateQuery } from 'mongoose';

import { config } from '@/config/config';
import {
  findDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  updateManyDoc,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import {
  ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL,
  ORDER_PAYMENT_SHIPPING_SUCCESS_SMS,
} from '@/helpers/template.helper';
import { ICart } from '@/models/cart';
import { IInventory, IInventoryLog } from '@/models/inventory';
import { IPayment } from '@/models/payment';
import { IProduct, IProductSKU, IProductVariant } from '@/models/product';
import { IAddress } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';

import { INVENTORYTYPE, PAYMENTSTATUS } from '../../helpers/constant.helper';
import { formatAddress } from '../../helpers/function.helper';
import { IOrder } from '../../models/orders';
import { handleEmail } from '../email/emailStrategy';
import { handleSMS } from '../sms/smsStrategy';

import {
  IOrderConfirmationNotification,
  IUpdateAllCartStatusBody,
  IUpdateAllCartStatusFilter,
  IUpdateStockInInventoryFilter,
} from './payment.service.type';

const {
  sms: { smsCarrier },
  email: { emailProvider },
} = config;

/**
 * Create payment
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Payment>}
 */
export const createPayment = async (
  filter: FilterQuery<IPayment>,
  reqBody: UpdateQuery<IPayment>,
  options = {}
): Promise<IPayment | null> => {
  return findOneAndUpdateDoc<IPayment>(
    MONGOOSE_MODELS.PAYMENT,
    filter,
    reqBody,
    options
  );
};

/**
 * Update All Cart Status
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns
 */
export const updateAllCartStatus = async (
  filter: IUpdateAllCartStatusFilter,
  reqBody: IUpdateAllCartStatusBody
): Promise<void> => {
  try {
    const { cartIds } = filter;

    const cartIdsData = (await findDoc<ICart>(MONGOOSE_MODELS.CART, {
      _id: { $in: cartIds?.map(i => i) },
      status: PAYMENTSTATUS.PENDING,
    })) as ICart[];

    if (!cartIdsData?.length || cartIds?.length !== cartIdsData.length) {
      console.error('Remove Cart : Mismatch between cart products');
      return;
    }

    await updateManyDoc<ICart>(
      MONGOOSE_MODELS.CART,
      {
        _id: { $in: cartIds?.map(i => i) },
        status: PAYMENTSTATUS.PENDING,
      },
      reqBody
    );
    return;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ updateAllCartStatus ~ error:', error);
  }
};

/**
 * Order confirmation SMS
 * @param {object} payload
 */
export const orderConfirmationSMS = async (
  payload: IOrderConfirmationNotification
): Promise<void> => {
  try {
    const { userData, userProfileData, order } = payload;
    await handleSMS(smsCarrier).sendSMS({
      to: userData?.phone_number,
      body: ORDER_PAYMENT_SHIPPING_SUCCESS_SMS({
        customerName: `${userProfileData?.first_name} ${
          userProfileData?.last_name ? userProfileData?.last_name : ''
        }`,
        orderDate:
          moment(order?.updatedAt).format('DD-MM-YYYY') ||
          moment().format('DD-MM-YYYY'),
        orderId: String(order?._id),
        storeName: 'PCMall',
      }),
    });
  } catch (error) {
    console.log('🚀 ~ orderConfirmationSMS ~ error:', error);
  }
};

/**
 * Order confirmation Email
 * @param {object} payload
 * @returns
 */
export const orderConfirmationEmail = async (
  payload: IOrderConfirmationNotification
): Promise<void> => {
  try {
    const { userData, userProfileData, order } = payload;

    const userAddressData = await findOneDoc<IAddress>(
      MONGOOSE_MODELS.ADDRESS,
      {
        _id: order?.shippingAddress,
      }
    );

    if (!userAddressData) console.log('Error: User Address not available!');

    if (userAddressData) {
      const orderProductList = await generateOrderList(order);

      const isEmailSend = await handleEmail(emailProvider!).sendEmail(
        userData.email,
        ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL({
          orderId: String(order._id),
        }),
        {
          user_name: userProfileData?.first_name || 'User',
          order_number: order._id,
          tracking_number: order._id,
          delivery_address_line1: formatAddress(userAddressData)[0],
          delivery_address_line2: formatAddress(userAddressData)[2],
          delivery_address_line3: formatAddress(userAddressData)[3],
          order_product_list: orderProductList,
        },
        path.join(__dirname, '../../../views/order_success.ejs')
      );
      if (isEmailSend) console.log('Email is send successfully');
    }
  } catch (error: unknown) {
    console.log('🚀 ~ orderConfirmationEmail ~ error:', error);
  }
};

/**
 * Update Stock In Inventory
 * @param {object} payload
 * @param {object} reqBody
 * @param {object} options
 * @returns
 */
export const updateStockInInventory = async (
  payload: IUpdateStockInInventoryFilter
): Promise<void> => {
  try {
    const { order, eventType } = payload;
    /** Inventory Management */
    for (const orderItem of order.items) {
      // eslint-disable-next-line no-await-in-loop
      const productSkuData = await findOneDoc<IProductSKU>(
        MONGOOSE_MODELS.PRODUCT_SKU,
        {
          variant: orderItem.variant,
        }
      );

      // eslint-disable-next-line no-await-in-loop
      const inventoryData = await findOneDoc<IInventory>(
        MONGOOSE_MODELS.INVENTORY,
        {
          sku: productSkuData?._id,
        }
      );

      if (!inventoryData) {
        console.error('updateStockInInventory: Inventory not found');
        return;
      }

      let payload = {};
      let inventoryPayload = {};
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (eventType) {
        case 'checkout.session.completed':
          inventoryPayload = {
            $inc: { stock: -orderItem.quantity, reserved: orderItem.quantity },
          };

          payload = {
            inventory: inventoryData._id,
            type: INVENTORYTYPE.RESERVE,
            quantity: orderItem.quantity,
            reference: null,
          };
          break;

        default:
          inventoryPayload = {
            $inc: { stock: orderItem.quantity, reserved: -orderItem.quantity },
          };
          payload = {
            inventory: inventoryData._id,
            type: INVENTORYTYPE.ADJUSTMENT,
            quantity: orderItem.quantity,
            reference: null,
          };

          console.log(`ADJUSTMENT STOCK: ${orderItem?.quantity || 1}`);
          break;
      }

      /** If order success then update stock and reserved */
      // eslint-disable-next-line no-await-in-loop
      (await findOneAndUpdateDoc<IInventory>(
        MONGOOSE_MODELS.INVENTORY,
        { _id: inventoryData._id },
        inventoryPayload,
        {
          new: true,
        }
      )) as IInventory;

      /** Log the history of Inventory */
      // eslint-disable-next-line no-await-in-loop
      (await findOneAndUpdateDoc<IInventoryLog>(
        MONGOOSE_MODELS.INVENTORY_LOG,
        payload,
        payload,
        {
          upsert: true,
          new: true,
        }
      )) as IInventoryLog;

      console.log(
        '🚀 ~ updateStockInInventory ~ inventoryData:',
        inventoryData
      );
    }
    return;
  } catch (error) {
    console.log('🚀 ~ updateStockInInventory ~ error:', error);
  }
};

export const generateOrderList = async (
  order: IOrder
): Promise<
  {
    image: string;
    name: string;
    quantity: number;
  }[]
> => {
  return Promise.all(
    order.items.map(async productVariant => {
      const productVariantData = await findOneDoc<IProductVariant>(
        MONGOOSE_MODELS.PRODUCT_VARIANT,
        { _id: productVariant.variant }
      );

      if (!productVariantData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product variant not found');
      }

      const productData = await findOneDoc<IProduct>(MONGOOSE_MODELS.PRODUCT, {
        _id: productVariantData.product,
      });

      if (!productData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
      }

      return {
        image: productVariantData.images[0] || '-',
        name: productData.title || 'Product title',
        quantity: productVariant.quantity || 1,
      };
    })
  );
};
