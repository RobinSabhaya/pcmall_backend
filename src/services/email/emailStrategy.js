const smtp = require('./providers/smtp');

const strategyMap = {
  smtp,
};

function handleEmail(carrierKey) {
  const strategy = strategyMap[carrierKey];
  if (!strategy) throw new Error(`Email strategy "${carrierKey}" not found`);
  return strategy;
}

module.exports = { handleEmail };
