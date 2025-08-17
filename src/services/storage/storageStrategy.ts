import * as minIO from './providers/minIo.storage.service';

const strategyMap = {
  minIO,
};

type Strategy = (typeof strategyMap)[keyof typeof strategyMap];

export function handleStorage(storageProvider: string): Strategy {
  const strategy = strategyMap[storageProvider as keyof typeof strategyMap];
  if (strategy == null)
    throw new Error(`Storage strategy "${storageProvider}" not found`);
  return strategy;
}
