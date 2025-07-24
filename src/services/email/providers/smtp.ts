import ejs from 'ejs';
import nodemailer from 'nodemailer';
import { config } from '../../../config/config';

const {
  env,
  email: { smtp, from },
} = config;

const transport = nodemailer.createTransport(smtp);
/* istanbul ignore next */
if (env !== 'test') {
  transport
    .verify()
    .then(() => console.log('📧 Connected to email server 📧'))
    .catch(() =>
      console.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
      ),
    );
}

/**
 * Send mail to requested or verified email.
 * @param {email} to
 * @param {string} subject
 * @param {object} mailData
 * @param {string} filePath
 */
export const sendEmail = async (
  to: string,
  subject: string,
  mailData: object,
  filePath: string,
): Promise<boolean> => {
  try {
    const html = await ejs.renderFile(filePath, mailData);
    // Send the email
    await transport.sendMail({
      from,
      to,
      subject,
      html,
      replyTo: from,
    });

    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};
