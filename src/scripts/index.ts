import dbConnection from '@/plugins/mongoose';

import { fetchProducts } from './fetchProducts';

await (async (): Promise<void> => {
  try {
    await dbConnection(); // Db connect.

    await fetchProducts();
    process.exit(0);
  } catch (error) {
    console.log('🚀 ~ error:', error);
    process.exit(1);
  }
})();
