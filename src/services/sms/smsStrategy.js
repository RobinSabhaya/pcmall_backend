const twilio = require('./providers/twilio');

const strategyMap = {
  twilio,
};

function handleSMS(carrierKey) {
  const strategy = strategyMap[carrierKey];
  if (!strategy) throw new Error(`SMS strategy "${carrierKey}" not found`);
  return strategy;
}

module.exports = { handleSMS };
