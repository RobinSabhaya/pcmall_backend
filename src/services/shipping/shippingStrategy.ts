import * as shippo from './carriers/shippo';

const strategyMap = {
  shippo,
};

type Strategy = (typeof strategyMap)[keyof typeof strategyMap];

export function handleShipping(carrierKey: string): Strategy {
  const strategy = strategyMap[carrierKey as keyof typeof strategyMap];
  if (strategy === null)
    throw new Error(`Shipping strategy "${carrierKey}" not found`);
  return strategy;
}
