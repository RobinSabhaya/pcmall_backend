// const easypost = require("./carriers/easypost");
const shippo = require("./carriers/shippo");

const strategyMap = {
  // easypost,
  shippo,
};

async function handleShipping(carrierKey, order, session) {
  const strategy = strategyMap[carrierKey];
  if (!strategy) throw new Error(`Shipping strategy "${carrierKey}" not found`);
  return strategy(order, session);
}

module.exports = { handleShipping };
