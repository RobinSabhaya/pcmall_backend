import * as minIO  from './providers/minIO.service';

const strategyMap = {
  minIO,
};

export function handleStorage(storageProvider:string) {
  const strategy = strategyMap[storageProvider as keyof typeof strategyMap];
  if (!strategy) throw new Error(`Storage strategy "${storageProvider}" not found`);
  return strategy;
}