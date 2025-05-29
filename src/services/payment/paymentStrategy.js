const stripe = require('./providers/stripe.service');

const strategyMap = {
  stripe,
};

function handlePayment(paymentProvider) {
  const strategy = strategyMap[paymentProvider];
  if (!strategy) throw new Error(`Payment strategy "${paymentProvider}" not found`);
  return strategy;
}

module.exports = { handlePayment };
