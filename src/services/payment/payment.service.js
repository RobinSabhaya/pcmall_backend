const { Payment } = require('../../models/payment/index');
const {
  sms: { smsCarrier },
  email: { emailProvider },
} = require('../../config/config');
const logger = require('../../config/logger');
const {
  ORDER_PAYMENT_SHIPPING_SUCCESS_SMS,
  ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL,
} = require('../../helpers/template.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
const { findOneDoc, findOneAndUpdateDoc, findDoc, updateManyDoc } = require('../../helpers/mongoose.helper');
const { handleSMS } = require('../sms/smsStrategy');
const { handleEmail } = require('../email/emailStrategy');
const moment = require('moment');
const { PAYMENT_STATUS, INVENTORY_TYPE } = require('../../helpers/constant.helper');
const path = require('path');
const { formatAddress } = require('../../helpers/function.helper');
/**
 * Create payment
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns {Promise<Payment>}
 */
const createPayment = (filter, reqBody, options = {}) => {
  return Payment.findOneAndUpdate(filter, reqBody, options);
};

/**
 * Update All Cart Status
 * @param {object} filter
 * @param {object} reqBody
 * @param {object} options
 * @returns
 */
const updateAllCartStatus = async (filter, reqBody, options) => {
  try {
    const { cartIds } = filter;

    const cartIdsData = await findDoc(MONGOOSE_MODELS.CART, {
      _id: { $in: cartIds?.map((i) => i) },
      status: PAYMENT_STATUS.PENDING,
    });

    if (!cartIdsData?.length || cartIds?.length !== cartIdsData.length) {
      console.error('Remove Cart : Mismatch between cart products');
      return;
    }

    await updateManyDoc(
      MONGOOSE_MODELS.CART,
      {
        _id: { $in: cartIds?.map((i) => i) },
        status: PAYMENT_STATUS.PENDING,
      },
      reqBody
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
const orderConfirmationSMS = async (payload) => {
  try {
    const { userData, userProfileData, order } = payload;
    await handleSMS(smsCarrier).sendSMS({
      to: userData?.phone_number,
      body: ORDER_PAYMENT_SHIPPING_SUCCESS_SMS({
        customerName:
          userProfileData?.first_name + ' ' + (userProfileData?.last_name && userProfileData?.last_name) || 'User',
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
const orderConfirmationEmail = async (payload) => {
  try {
    const { userData, userProfileData, order } = payload;

    const userAddressData = await findOneDoc(MONGOOSE_MODELS.ADDRESS, {
      _id: order?.shippingAddress,
    });

    if (!userAddressData) console.log('Error: User Address not available!');

    const isEmailSend = await handleEmail(emailProvider).sendEmail(
      userData.email,
      ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL({
        orderId: order?._id || '',
      }),
      {
        user_name: userProfileData?.first_name || 'User',
        order_number: order._id,
        tracking_number: order._id,
        delivery_address_line1: formatAddress(userAddressData)[0],
        delivery_address_line2: formatAddress(userAddressData)[2],
        delivery_address_line3: formatAddress(userAddressData)[3],
      },
      path.join(__dirname, '../../../views/order_success.ejs')
    );

    if (isEmailSend) logger.info('Email is send successfully');
  } catch (error) {
    logger.error(error);
  }
};

/**
 * Update Stock In Inventory
 * @param {object} payload
 * @param {object} reqBody
 * @param {object} options
 * @returns
 */
const updateStockInInventory = async (payload, reqBody, options) => {
  try {
    const { order, eventType } = payload;
    /** Inventory Management */
    for (const orderItem of order?.items) {
      let productSkuData = await findOneDoc(MONGOOSE_MODELS.PRODUCT_SKU, { variant: orderItem.variant });
      let inventoryData = await findOneDoc(MONGOOSE_MODELS.INVENTORY, { sku: productSkuData._id });

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
      await findOneAndUpdateDoc(MONGOOSE_MODELS.INVENTORY, { _id: inventoryData._id }, inventoryPayload, {
        new: true,
      });

      /** Log the history of Inventory */
      await findOneAndUpdateDoc(MONGOOSE_MODELS.INVENTORY_LOG, payload, payload, {
        upsert: true,
        new: true,
      });

      console.log('🚀 ~ updateStockInInventory ~ inventoryData:', inventoryData);
    }
    return;
  } catch (error) {
    console.log('🚀 ~ updateStockInInventory ~ error:', error);
  }
};

module.exports = {
  createPayment,
  updateAllCartStatus,
  orderConfirmationSMS,
  orderConfirmationEmail,
  updateStockInInventory,
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
