const { Payment } = require('../../models/payment/index');
const {
  sms: { smsCarrier },
} = require('../../config/config');
const { ORDER_PAYMENT_SHIPPING_SUCCESS_SMS } = require('../../helpers/template.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
const { findOneDoc, findOneAndUpdateDoc, findDoc, updateManyDoc } = require('../../helpers/mongoose.helper');
const { handleSMS } = require('../sms/smsStrategy');
const moment = require('moment');
const { PAYMENT_STATUS } = require('../../helpers/constant.helper');
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
  const { userProfileData } = payload;
  // await handleEmail(smsCarrier).sendEmail({
  //   to: userData?.phone_number,
  //   body: ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL({
  //     customerName: userProfileData?.first_name + ' ' + (userProfileData?.last_name && userProfileData?.last_name) || 'User',
  //     orderDate: moment(order?.updatedAt).format('DD-MM-YYYY') || moment().format('DD-MM-YYYY'),
  //     orderId: String(order?._id),
  //     storeName: 'PCMall',
  //   }),
  // });
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

      switch (eventType) {
        case 'checkout.session.completed':
          /** If order success then update stock and reserved */
          inventoryData = await findOneAndUpdateDoc(
            MONGOOSE_MODELS.INVENTORY,
            { _id: inventoryData._id },
            {
              $inc: { stock: -orderItem.quantity, reserved: orderItem.quantity },
            },
            {
              new: true,
            }
          );
          break;

        default:
          /** If order success then update stock and reserved */
          inventoryData = await findOneAndUpdateDoc(
            MONGOOSE_MODELS.INVENTORY,
            { _id: inventoryData._id },
            {
              $inc: { stock: orderItem.quantity, reserved: -orderItem.quantity },
            },
            {
              new: true,
            }
          );
          break;
      }
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
