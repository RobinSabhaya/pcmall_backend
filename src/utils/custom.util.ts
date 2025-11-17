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
    ? {
        price: {
          $gte: Number(prices.min ?? 0),
          $lte: Number(prices.max ?? 1_000_000),
        },
      }
    : undefined;
};

export const toDeepObject = (data: unknown): unknown => {
  return JSON.parse(JSON.stringify(data));
};

export function generateSlug(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^\w\u0590-\u06FF]+/g, '-') // allow unicode letters
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}
