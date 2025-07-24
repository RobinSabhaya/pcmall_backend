import * as stripe from './providers/stripe.service';

const strategyMap = {
  stripe,
};

export function handlePayment(paymentProvider: string) {
  const strategy = strategyMap[paymentProvider as keyof typeof strategyMap];
  if (!strategy) throw new Error(`Payment strategy "${paymentProvider}" not found`);
  return strategy;
}
