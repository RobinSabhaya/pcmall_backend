import * as twilio from './providers/twilio';

const strategyMap = {
  twilio,
};

export function handleSMS(carrierKey:string) {
  const strategy = strategyMap[carrierKey as keyof typeof strategyMap];
  if (!strategy) throw new Error(`SMS strategy "${carrierKey}" not found`);
  return strategy;
}