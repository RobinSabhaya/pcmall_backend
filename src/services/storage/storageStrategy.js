const minIO = require('./providers/minIO.service');

const strategyMap = {
  minIO,
};

function handleStorage(storageProvider) {
  const strategy = strategyMap[storageProvider];
  if (!strategy) throw new Error(`Storage strategy "${storageProvider}" not found`);
  return strategy;
}

module.exports = { handleStorage };
