import { cleanupDatabase, setupDatabase } from './helpers/setupDatabase';

export async function setup(): Promise<void> {
  // Any global setup logic here
  console.log('🧪 Setting up TypeScript tests...');

  // setup database
  await setupDatabase();
}

export async function teardown(): Promise<void> {
  // Global cleanup
  console.log('🧹 Cleaning up TypeScript tests...');

  // cleanup database
  await cleanupDatabase();
}
