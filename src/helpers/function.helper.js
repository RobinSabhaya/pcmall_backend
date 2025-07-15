/**
 * Parse device info
 * @param {object} payload
 * @returns {object} deviceInfo
 */
const parseDeviceInfo = (payload) => {
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

/**
 * Generate address for shipping
 * @param {object} address
 * @returns {object} address
 */
const generateAddressForShipping = (address) => {
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
/**
 * Sanitize string
 * @param {string} str
 * @returns {string} string
 */
const sanitize = (str = '') => str.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

/**
 * abbreviate string
 * @param {string} str
 * @param {number} length
 * @returns {string} string
 */
const abbreviate = (str, length = 3) => sanitize(str).slice(0, length);

/**
 * Generate variant code
 * @param {object} variants
 * @param {number} length
 * @returns {string} string
 */
const generateVariantCode = (variants = {}, length = 2) =>
  Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => abbreviate(value, length))
    .join('');

/**
 * Generate random code
 * @param {number} length
 * @returns {string} string
 */
const generateRandomCode = (length = 4) =>
  Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36))
    .join('')
    .toUpperCase();

/**
 *
 * @param {} param0
 * @returns
 */
function generateSKU(payload) {
  const { name, category, brand = '', variants = {}, randomLength = 4, abbrevLength = 3, variantAbbrevLength = 2 } = payload;
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

function getItemVolume(item) {
  return item.length * item.width * item.height * item.quantity;
}

function getBoxVolume(box) {
  return box.length * box.width * box.height;
}

function getTotalWeight(cart) {
  return cart.reduce((sum, item) => sum + item.weightOz * item.quantity, 0);
}

function getTotalVolume(cart) {
  return cart.reduce((sum, item) => sum + getItemVolume(item), 0);
}

/**
 * Try fitting into available boxes by volume + dimension constraints
 * @param {object} cart
 * @returns {object} selected box
 */
function selectBestBox(cart) {
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
      { length: 0, width: 0, height: 0 }
    );

    if (box.length >= maxItem.length && box.width >= maxItem.width && box.height >= maxItem.height) {
      return box;
    }
  }

  return null;
}

/**
 * Build parcel objects
 * @param {object} cart
 * @returns
 */
function buildParcelObject(cart) {
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

/**
 * Formats an address object into a clean, readable string.
 *
 * @param {Object} address - The address fields.
 * @param {string} address.line1 - Required address line 1.
 * @param {string} [address.line2] - Optional address line 2.
 * @param {string} address.city - Required city.
 * @param {string} address.state - Required state.
 * @param {string} address.country - Required country.
 * @returns {string} Formatted address string.
 * @throws Will throw an error if any required field is missing or empty.
 */
function formatAddress(address) {
  const requiredFields = ['line1', 'city', 'state', 'country'];

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

module.exports = {
  parseDeviceInfo,
  generateAddressForShipping,
  generateSKU,
  selectBestBox,
  buildParcelObject,
  formatAddress,
};
