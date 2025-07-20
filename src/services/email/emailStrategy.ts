import * as smtp from './providers/smtp';

const strategyMap = {
  smtp,
};

export function handleEmail(carrierKey:string) {
  const strategy = strategyMap[carrierKey as keyof typeof strategyMap];
  if (!strategy) throw new Error(`Email strategy "${carrierKey}" not found`);
  return strategy;
}