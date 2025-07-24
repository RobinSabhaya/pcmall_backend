import * as shippo from './carriers/shippo';

const strategyMap = {
  shippo,
};

export function handleShipping(carrierKey: string) {
  const strategy = strategyMap[carrierKey as keyof typeof strategyMap];
  if (!strategy) throw new Error(`Shipping strategy "${carrierKey}" not found`);
  return strategy;
}
