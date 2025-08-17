import * as stripe from './providers/stripe.service';

const strategyMap = {
  stripe,
};

type Strategy = (typeof strategyMap)[keyof typeof strategyMap];

export function handlePayment(paymentProvider: string): Strategy {
  const strategy = strategyMap[paymentProvider as keyof typeof strategyMap];
  if (strategy == null)
    throw new Error(`Payment strategy "${paymentProvider}" not found`);
  return strategy;
}
