import { IAddress } from '../models/user';

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
export const parseDeviceInfo = (payload: IParseDeviceInfo): IParseDeviceInfo => {
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

interface IgenerateAddressForShipping extends IAddress {
  phone: string;
  email: string;
}
export const generateAddressForShipping = (address: IgenerateAddressForShipping) => {
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
  str.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

export const abbreviate = (str: string, length: number = 3): string =>
  sanitize(str).slice(0, length);

export const generateVariantCode = (variants: object = {}, length: number = 2) =>
  Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => abbreviate(value as string, length))
    .join('');

export const generateRandomCode = (length: number = 4): string =>
  Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36))
    .join('')
    .toUpperCase();

export interface GenerateSKU {
  name: string;
  category: string;
  brand: string;
  variants?: object;
  randomLength?: number;
  abbrevLength?: number;
  variantAbbrevLength?: number;
}

export function generateSKU(payload: GenerateSKU): string {
  const {
    name,
    category,
    brand = '',
    variants = {},
    randomLength = 4,
    abbrevLength = 3,
    variantAbbrevLength = 2,
  } = payload;
  if (!name || !category) throw new Error('Product name and category are required.');

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
  return cart.reduce((sum: number, item: Iitem) => sum + item.weightOz * item.quantity, 0);
}

export function getTotalVolume(cart: Iitem[]) {
  return cart.reduce((sum: number, item: Iitem) => sum + getItemVolume(item), 0);
}

export function selectBestBox(cart: Iitem[]) {
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

  for (let box of boxes) {
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

export function buildParcelObject(cart: Iitem[]) {
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

export function formatAddress(address: IAddress): Array<string> | string {
  const requiredFields = ['line1', 'city', 'state', 'country'] as const;

  // Validate required fields
  for (const field of requiredFields) {
    if (!address[field] || typeof address[field] !== 'string' || !address[field].trim()) {
      return 'Invalid address';
    }
  }

  const { line1, line2, city, state, country } = address;

  const parts = [
    line1.trim(),
    line2?.trim(), // optional
    `\n${city.trim()}, ${state.trim()}`,
    country.trim(),
  ];

  return parts;
}
