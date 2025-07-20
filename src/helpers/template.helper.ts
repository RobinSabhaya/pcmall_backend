interface IORDER_PAYMENT_SHIPPING_SUCCESS_SMS {
  customerName: string;
  orderDate: string;
  orderId: string;
  storeName: string;
}

interface IORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL {
  customerName?: string;
  orderDate?: string;
  orderId?: string;
  storeName?: string;
}

export const ORDER_PAYMENT_SHIPPING_SUCCESS_SMS = (payload: IORDER_PAYMENT_SHIPPING_SUCCESS_SMS): string => {
  const { customerName, orderDate, orderId, storeName } = payload;
  return `
🛒 Thank you for your order!
Order #${orderId} placed successfully on ${orderDate}.
We'll notify you once it's shipped.
${storeName}`;
};

export const ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL = (payload: IORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL): string => {
  const { customerName, orderDate, orderId, storeName } = payload;
  return `Order ${orderId} is confirm!`;
};

