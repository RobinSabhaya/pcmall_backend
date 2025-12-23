import { Address } from '../../address/schema/address.schema';

export const buildArrayFilter = (
  array: string[],
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

export const str2regex = (searchStr: string): string => {
  const regexStr = [...searchStr];

  regexStr.forEach((ele, ind) => {
    if (
      [
        '.',
        '+',
        '*',
        '?',
        '^',
        '$',
        '(',
        ')',
        '[',
        ']',
        '{',
        '}',
        '|',
        '\\',
      ].includes(ele)
    )
      regexStr[ind] = `\\${regexStr[ind]}`;
  });

  return regexStr.join('');
};

export const formatPrice = (
  price: number,
  fractionDigits: number = 2,
): number => +price.toFixed(fractionDigits);

interface IParseDeviceInfo {
  device_id: string;
  device_type: string;
  os: {
    name: string;
    version: string;
  };
  browser: {
    name: string;
    version: string;
  };
  brand: string;
  model: string;
  user_agent: string;
}

/**
 * Parse device info
 * @param {object} payload
 * @returns {object} deviceInfo
 */
export const parseDeviceInfo = (
  payload: IParseDeviceInfo,
): IParseDeviceInfo => {
  return {
    device_id: payload.device_id,
    device_type: payload.device_type || 'Desktop',
    os: {
      name: payload.os.name,
      version: payload.os.version,
    },
    browser: {
      name: payload.browser.name,
      version: payload.browser.version,
    },
    brand: payload.brand || 'Unknown',
    model: payload.model || 'Unknown',
    user_agent: '',
  };
};

interface IGenerateAddressForShipping extends Address {
  phone: string;
  email: string;
}
interface IGenerateAddressForShippingResponse {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}
export const generateAddressForShipping = (
  address: IGenerateAddressForShipping,
): IGenerateAddressForShippingResponse => {
  return {
    name: address.line1,
    street1: address.line1,
    city: address.city,
    state: address.state,
    zip: address.postalCode,
    country: address.country,
    phone: address.phone,
    email: address.email,
  };
};

export const sanitize = (str: string = ''): string =>
  str.replace(/[^\dA-Za-z]/g, '').toUpperCase();

//
export const abbreviate = (str: string, length: number = 3): string =>
  sanitize(str).slice(0, length);

export const generateVariantCode = (
  variants: object = {},
  //
  length: number = 2,
): string =>
  Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => abbreviate(value as string, length))
    .join('');

//
export const generateRandomCode = (length: number = 4): string =>
  //
  Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36))
    .join('')
    .toUpperCase();

export interface IGenerateSKU {
  name: string;
  category: string;
  brand: string;
  variants?: object;
  randomLength?: number;
  abbrevLength?: number;
  variantAbbrevLength?: number;
}

export function generateSKU(payload: IGenerateSKU): string {
  const {
    name,
    category,
    brand = '',
    variants = {},
    //
    randomLength = 4,
    //
    abbrevLength = 3,
    //
    variantAbbrevLength = 2,
  } = payload;
  if (!name || !category)
    throw new Error('Product name and category are required.');

  const parts = [
    abbreviate(brand, abbrevLength),
    abbreviate(category, abbrevLength),
    abbreviate(name, abbrevLength),
    generateVariantCode(variants, variantAbbrevLength),
    generateRandomCode(randomLength),
  ];

  return parts.filter(Boolean).join('-');
}

type Iitem = {
  length: number;
  width: number;
  height: number;
  quantity: number;
  weightOz: number;
};

type Ibox = {
  length: number;
  width: number;
  height: number;
};

export function getItemVolume(item: Iitem): number {
  return item.length * item.width * item.height * item.quantity;
}

export function getBoxVolume(box: Ibox): number {
  return box.length * box.width * box.height;
}

export function getTotalWeight(cart: Iitem[]): number {
  return cart.reduce(
    (sum: number, item: Iitem) => sum + item.weightOz * item.quantity,
    0,
  );
}

export function getTotalVolume(cart: Iitem[]): number {
  return cart.reduce(
    (sum: number, item: Iitem) => sum + getItemVolume(item),
    0,
  );
}

export function selectBestBox(cart: Iitem[]): Ibox | null {
  const boxes = [
    { name: 'Small Box', length: 8, width: 6, height: 2 },

    { name: 'Medium Box', length: 12, width: 9, height: 4 },

    { name: 'Large Box', length: 16, width: 12, height: 6 },
  ];

  // const cartItems = [
  //   {
  //     name: 'T-shirt',

  //     quantity: 3,

  //     weightOz: 8,

  //     length: 10,

  //     width: 8,

  //     height: 1,
  //   },

  //   {
  //     name: 'Mug',

  //     quantity: 2,

  //     weightOz: 16,

  //     length: 5,

  //     width: 5,

  //     height: 5,
  //   },
  // ];

  const totalVolume = getTotalVolume(cart);

  for (const box of boxes) {
    const boxVolume = getBoxVolume(box);

    if (boxVolume < totalVolume) continue;

    // Check max dimension fit (simplified)

    const maxItem = cart.reduce(
      (acc, item) => {
        acc.length = Math.max(acc.length, item.length);

        acc.width = Math.max(acc.width, item.width);

        acc.height = Math.max(acc.height, item.height);

        return acc;
      },
      { length: 0, width: 0, height: 0 },
    );

    if (
      box.length >= maxItem.length &&
      box.width >= maxItem.width &&
      box.height >= maxItem.height
    ) {
      return box;
    }
  }

  return null;
}

export interface IParcelObject extends Ibox {
  distance_unit: string;
  weight: number;
  mass_unit: string;
}

export function buildParcelObject(cart: Iitem[]): IParcelObject {
  const totalWeightOz = getTotalWeight(cart);

  const selectedBox = selectBestBox(cart);

  if (!selectedBox) {
    throw new Error('No available box fits the items.');
  }

  return {
    length: selectedBox.length,
    width: selectedBox.width,
    height: selectedBox.height,
    distance_unit: 'in',
    weight: totalWeightOz,
    mass_unit: 'oz',
  };
}

export function formatAddress(address: Address): Array<string> | string {
  const requiredFields = ['line1', 'city', 'state', 'country'] as const;

  // Validate required fields
  for (const field of requiredFields) {
    // eslint-disable-next-line security/detect-object-injection
    const value = address[field];
    if (typeof value !== 'string' || !value.trim()) {
      return 'Invalid address';
    }
  }

  const { line1, line2, city, state, country } = address;

  return [
    line1.trim(),
    line2?.trim(), // optional
    `\n${city.trim()}, ${state.trim()}`,
    country.trim(),
  ];
}
