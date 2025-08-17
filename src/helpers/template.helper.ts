interface IOrderPaymentShippingSuccessSms {
  customerName: string;
  orderDate: string;
  orderId: string;
  storeName: string;
}

interface IOrderPaymentShippingSuccessEmail {
  customerName?: string;
  orderDate?: string;
  orderId?: string;
  storeName?: string;
}

export const ORDER_PAYMENT_SHIPPING_SUCCESS_SMS = (
  payload: IOrderPaymentShippingSuccessSms
): string => {
  const { orderDate, orderId, storeName } = payload;
  return `
🛒 Thank you for your order!
Order #${orderId} placed successfully on ${orderDate}.
We'll notify you once it's shipped.
${storeName}`;
};

export const ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL = (
  payload: IOrderPaymentShippingSuccessEmail
): string => {
  const { orderId } = payload;
  return `Order ${orderId} is confirm!`;
};
