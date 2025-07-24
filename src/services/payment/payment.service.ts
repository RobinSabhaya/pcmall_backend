import { IPayment, Payment } from '@/models/payment';
import { config } from '@/config/config';
import {
  ORDER_PAYMENT_SHIPPING_SUCCESS_SMS,
  ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL,
} from '@/helpers/template.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { findOneDoc, findOneAndUpdateDoc, findDoc, updateManyDoc } from '@/helpers/mongoose.helper';
import { handleSMS } from '../sms/smsStrategy';
import { handleEmail } from '../email/emailStrategy';
import moment from 'moment';
import { PAYMENT_STATUS, INVENTORY_TYPE } from '../../helpers/constant.helper';
import path from 'path';
import { formatAddress } from '../../helpers/function.helper';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { ICart } from '@/models/cart';
import {
  OrderConfirmationNotification,
  UpdateAllCartStatusBody,
  UpdateAllCartStatusFilter,
  UpdateStockInInventoryBody,
  UpdateStockInInventoryFilter,
} from './payment.service.type';
import { IAddress } from '@/models/user';
import { IProductSKU } from '@/models/product';
import { IInventory, IInventoryLog } from '@/models/inventory';

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
export const createPayment = (
  filter: FilterQuery<IPayment>,
  reqBody: UpdateQuery<IPayment>,
  options = {},
): Promise<IPayment | null> => {
  return findOneAndUpdateDoc<IPayment>(MONGOOSE_MODELS.PAYMENT, filter, reqBody, options);
};

/**
 * Update All Cart Status
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns
 */
export const updateAllCartStatus = async (
  filter: UpdateAllCartStatusFilter,
  reqBody: UpdateAllCartStatusBody,
  options: object = {},
) => {
  try {
    const { cartIds } = filter;

    const cartIdsData = (await findDoc<ICart>(MONGOOSE_MODELS.CART, {
      _id: { $in: cartIds?.map((i) => i) },
      status: PAYMENT_STATUS.PENDING,
    })) as ICart[];

    if (!cartIdsData?.length || cartIds?.length !== cartIdsData.length) {
      console.error('Remove Cart : Mismatch between cart products');
      return;
    }

    await updateManyDoc<ICart>(
      MONGOOSE_MODELS.CART,
      {
        _id: { $in: cartIds?.map((i) => i) },
        status: PAYMENT_STATUS.PENDING,
      },
      reqBody,
    );
    return;
  } catch (error) {
    console.log('🚀 ~ updateAllCartStatus ~ error:', error);
  }
};

/**
 * Order confirmation SMS
 * @param {object} payload
 */
export const orderConfirmationSMS = async (payload: OrderConfirmationNotification) => {
  try {
    const { userData, userProfileData, order } = payload;
    await handleSMS(smsCarrier).sendSMS({
      to: userData?.phone_number,
      body: ORDER_PAYMENT_SHIPPING_SUCCESS_SMS({
        customerName:
          userProfileData?.first_name +
            ' ' +
            (userProfileData?.last_name && userProfileData?.last_name) || 'User',
        orderDate: moment(order?.updatedAt).format('DD-MM-YYYY') || moment().format('DD-MM-YYYY'),
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
export const orderConfirmationEmail = async (payload: OrderConfirmationNotification) => {
  try {
    const { userData, userProfileData, order } = payload;

    const userAddressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS, {
      _id: order?.shippingAddress,
    });

    if (!userAddressData) console.log('Error: User Address not available!');

    if (userAddressData) {
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
        },
        path.join(__dirname, '../../../views/order_success.ejs'),
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
  payload: UpdateStockInInventoryFilter,
  reqBody?: UpdateStockInInventoryBody,
  options: object = {},
) => {
  try {
    const { order, eventType } = payload;
    /** Inventory Management */
    for (const orderItem of order?.items) {
      let productSkuData = await findOneDoc<IProductSKU>(MONGOOSE_MODELS.PRODUCT_SKU, {
        variant: orderItem.variant,
      });

      let inventoryData = await findOneDoc<IInventory>(MONGOOSE_MODELS.INVENTORY, {
        sku: productSkuData?._id,
      });

      if (!inventoryData) {
        console.error('updateStockInInventory: Inventory not found');
        return;
      }

      let payload = {};
      let inventoryPayload = {};
      switch (eventType) {
        case 'checkout.session.completed':
          inventoryPayload = {
            $inc: { stock: -orderItem.quantity, reserved: orderItem.quantity },
          };

          payload = {
            inventory: inventoryData._id,
            type: INVENTORY_TYPE.RESERVE,
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
            type: INVENTORY_TYPE.ADJUSTMENT,
            quantity: orderItem.quantity,
            reference: null,
          };

          console.log(`ADJUSTMENT STOCK: ${orderItem?.quantity || 1}`);
          break;
      }

      /** If order success then update stock and reserved */
      (await findOneAndUpdateDoc<IInventory>(
        MONGOOSE_MODELS.INVENTORY,
        { _id: inventoryData._id },
        inventoryPayload,
        {
          new: true,
        },
      )) as IInventory;

      /** Log the history of Inventory */
      (await findOneAndUpdateDoc<IInventoryLog>(MONGOOSE_MODELS.INVENTORY_LOG, payload, payload, {
        upsert: true,
        new: true,
      })) as IInventoryLog;

      console.log('🚀 ~ updateStockInInventory ~ inventoryData:', inventoryData);
    }
    return;
  } catch (error) {
    console.log('🚀 ~ updateStockInInventory ~ error:', error);
  }
};

// (async () => {
//   /** Get User data */
//   const userData = await findOneDoc(MONGOOSE_MODELS.USER, {
//     _id: '6831df657b12972b30c15188',
//   });
//   const userProfileData = await findOneDoc(MONGOOSE_MODELS.USER_PROFILE, {
//     user: '6831df657b12972b30c15188',
//   });
//   const order = await findOneDoc(MONGOOSE_MODELS.ORDER, {
//     _id: '6873533b0e4d3db68769ac6a',
//   });

//   orderConfirmationEmail({
//     userData,
//     userProfileData,
//     order,
//   });
// })();
