const { fetchProducts } = require('./fetchProducts');
const { dbConnection } = require('../models/dbConnection');

(async () => {
  try {
    await dbConnection(); // Db connect.

    await fetchProducts();
    process.exit(0);
  } catch (error) {
    console.log('🚀 ~ error:', error);
    process.exit(1);
  }
})();
