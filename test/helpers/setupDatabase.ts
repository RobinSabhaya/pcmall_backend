import mongoose, { Mongoose } from 'mongoose';

import { config } from '../../src/config/config';

export const setupDatabase = async (): Promise<Mongoose | Error> => {
  try {
    const db = await mongoose.connect(`${config.mongoose.url}-test`);
    console.log('Database connected ✅');
    return db;
  } catch (error) {
    throw new Error(`MongoDB connection error ${error}`);
  }
};

export const cleanupDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.dropDatabase();

    console.log('Database cleanup completed 🧹');
  } catch (error) {
    console.error('Database cleanup failed ❌', error);
    throw error instanceof Error
      ? new Error(`Database cleanup error: ${error.message}`)
      : new Error('Unknown database cleanup error');
  } finally {
    await mongoose.disconnect();
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    console.log('Database disconnected');
  } catch (error) {
    throw error instanceof Error
      ? new Error(`Database cleanup error: ${error.message}`)
      : new Error('Unknown database cleanup error');
  }
};
