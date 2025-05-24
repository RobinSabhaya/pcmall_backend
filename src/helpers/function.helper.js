/**
 * Parse device info
 * @param {object} payload
 * @returns {object} deviceInfo
 */
const parseDeviceInfo = (payload) => {
  return {
    device_id : payload.device_id,
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

module.exports = {
  parseDeviceInfo,
};
