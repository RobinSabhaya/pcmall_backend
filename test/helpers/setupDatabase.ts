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
    // Check if connection exists and is ready
    if (mongoose.connection.readyState !== 0) {
      // Drop database only if connected
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
      }
      console.log('Database cleanup completed 🧹');
    }
  } catch (error) {
    throw error instanceof Error
      ? new Error(`Database cleanup failed ❌: ${error.message}`)
      : new Error('Unknown database cleanup error');
  } finally {
    // Force close connection if still open
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(true);
    }
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
