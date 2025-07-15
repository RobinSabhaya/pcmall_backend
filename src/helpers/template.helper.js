const ORDER_PAYMENT_SHIPPING_SUCCESS_SMS = (payload) => {
  const { customerName, orderDate, orderId, storeName } = payload;
  return `
🛒 Thank you for your order!
Order #${orderId} placed successfully on ${orderDate}.
We'll notify you once it's shipped.
${storeName}`;
};

const ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL = (payload) => {
  const { customerName, orderDate, orderId, storeName } = payload;
  return `Order ${orderId} is confirm!`;
};

module.exports = {
  ORDER_PAYMENT_SHIPPING_SUCCESS_SMS,
  ORDER_PAYMENT_SHIPPING_SUCCESS_EMAIL,
};
