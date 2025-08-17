import fp from 'fastify-plugin';
import mongoose from 'mongoose';

import { config } from '../config/config';

export default fp(async () => {
  try {
    await mongoose.connect(config.mongoose.url);
    // eslint-disable-next-line no-console
    console.log('Database connected ✅');
  } catch (error) {
    throw new Error(`MongoDB connection error ${error}`);
  }
});
