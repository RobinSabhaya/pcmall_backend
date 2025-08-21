import { cleanupDatabase } from './helpers/setupDatabase';

export function setup(): void {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  // Any global setup logic here
  console.log('🧪 Setting up TypeScript tests...');
}

export async function teardown(): Promise<void> {
  // Global cleanup
  console.log('🧹 Cleaning up TypeScript tests...');
  // cleanup database
  await cleanupDatabase();
}
