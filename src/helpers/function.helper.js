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

module.exports = {
  parseDeviceInfo,
  generateAddressForShipping,
  generateSKU,
};
