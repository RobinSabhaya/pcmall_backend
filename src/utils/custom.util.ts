export const buildArrayFilter = (
  array: string[]
): { $in: unknown } | undefined => {
  return array?.length > 0 ? { $in: array } : undefined;
};

export const buildPriceFilter = (prices: {
  min?: number;
  max?: number;
}): { price: { $gte: number; $lte: number } } | undefined => {
  const hasMinOrMax = prices?.min !== undefined || prices?.max !== undefined;
  return hasMinOrMax
    ? { price: { $gte: prices.min ?? 0, $lte: prices.max ?? 1_000_000 } }
    : undefined;
};

export const toDeepObject = (data: unknown): unknown => {
  return JSON.parse(JSON.stringify(data));
};
