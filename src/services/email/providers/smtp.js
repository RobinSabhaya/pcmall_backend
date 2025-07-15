const ejs = require('ejs');
const nodemailer = require('nodemailer');
const {
  env,
  email: { smtp, from },
} = require('../../../config/config');
const logger = require('../../../config/logger');

const transport = nodemailer.createTransport(smtp);
/* istanbul ignore next */
if (env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('📧 Connected to email server 📧'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send mail to requested or verified email.
 * @param {email} to
 * @param {string} subject
 * @param {object} mailData
 * @param {string} filePath
 */
const sendEmail = async (to, subject, mailData, filePath) => {
  const sendMail = await new Promise((resolve, reject) => {
    ejs.renderFile(filePath, mailData, async (err, data) => (err ? reject(err) : resolve(data)));
  }) // Render the filePath of ejs.
    .then(async (data) => {
      const mailSend = await transport
        .sendMail({
          from,
          to,
          subject,
          html: data,
          replyTo: from,
        })
        .then(() => true)
        .catch(() => false);

      return !mailSend ? false : true;
    })
    .catch(async () => false);
  return sendMail;
};

module.exports = {
  transport,
  sendEmail,
};
