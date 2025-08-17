import * as smtp from './providers/smtp';

const strategyMap = {
  smtp,
};

type Strategy = (typeof strategyMap)[keyof typeof strategyMap];

export function handleEmail(carrierKey: string): Strategy {
  const strategy = strategyMap[carrierKey as keyof typeof strategyMap];
  if (strategy == null)
    throw new Error(`Email strategy "${carrierKey}" not found`);
  return strategy;
}
