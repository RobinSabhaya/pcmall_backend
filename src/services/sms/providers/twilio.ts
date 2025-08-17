import twilio from 'twilio';

import { config } from '../../../config/config';

const {
  sms: { accountAuthToken, accountPhoneNumber, accountSid },
} = config;

const client = twilio(accountSid, accountAuthToken);

interface ISendSMS {
  to: string;
  body: string;
}

export const sendSMS = async (payload: ISendSMS): Promise<boolean> => {
  const { to, body } = payload;
  try {
    const message = await client.messages.create({
      body,
      from: accountPhoneNumber,
      to,
    });

    console.log('SMS sent successfully', { sid: message.sid });
    return true;
  } catch (error) {
    console.log('🚀 ~ sendSMS ~ error:', error);
    return false;
  }
};
