import twilio from 'twilio';
import {
  config
} from '../../../config/config';
const { sms: { accountAuthToken, accountPhoneNumber, accountSid }, } = config;

const client = twilio(accountSid, accountAuthToken);

interface sendSMS { 
  to: string;
  body: string;
}

export const sendSMS = async (payload:sendSMS) => {
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
