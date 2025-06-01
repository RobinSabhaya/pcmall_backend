const ORDER_PAYMENT_SHIPPING_SUCCESS_SMS = (payload) => {
  const { customerName, orderDate, orderId, storeName } = payload;
  return `
🛒 Thank you for your order, ${customerName}!

Order #${orderId} placed successfully on ${orderDate}.
We'll notify you once it's shipped.

Need help? Reply HELP or visit our support center.

${storeName}`;
};

module.exports = {
  ORDER_PAYMENT_SHIPPING_SUCCESS_SMS,
};
