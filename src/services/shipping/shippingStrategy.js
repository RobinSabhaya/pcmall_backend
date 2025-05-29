// const easypost = require("./carriers/easypost");
const shippo = require('./carriers/shippo');

const strategyMap = {
  // easypost,
  shippo,
};

function handleShipping(carrierKey) {
  const strategy = strategyMap[carrierKey];
  if (!strategy) throw new Error(`Shipping strategy "${carrierKey}" not found`);
  return strategy;
}

module.exports = { handleShipping };
