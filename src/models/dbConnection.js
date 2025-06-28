const logger = require('../config/logger');
const config = require('../config/config');
const mongoose = require('mongoose');

const dbConnection = () => {
  mongoose
    .connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
      logger.info('Database connected ✅');
    })
    .catch((err) => {
      logger.error('Database not connected ❌');
    });
};

module.exports = {
  dbConnection,
};
