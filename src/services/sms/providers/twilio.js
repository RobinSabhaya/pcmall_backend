const twilio = require('twilio');
const {
  sms: { accountAuthToken, accountPhoneNumber, accountSid },
} = require('../../../config/config');

const client = twilio(accountSid, accountAuthToken);

const sendSMS = async (payload) => {
  const { to, body } = payload;
  try {
    const message = await client.messages.create({
      body,
      from: accountPhoneNumber,
      to,
    });

    console.log('SMS sent successfully', { sid: message.sid });
    return message;
  } catch (error) {
    console.log('🚀 ~ sendSMS ~ error:', error);
    return error;
  }
};

module.exports = {
  sendSMS,
};
