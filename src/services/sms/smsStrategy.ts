import * as twilio from './providers/twilio';

const strategyMap = {
  twilio,
};

type Strategy = (typeof strategyMap)[keyof typeof strategyMap];

export function handleSMS(carrierKey: string): Strategy {
  const strategy = strategyMap[carrierKey as keyof typeof strategyMap];
  if (strategy === null)
    throw new Error(`SMS strategy "${carrierKey}" not found`);
  return strategy;
}
