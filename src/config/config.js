const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),

    // JWT Authentication
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),

    // SMTP
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    SMTP_MAIL: Joi.string().description('Nodemailer mail'),

    // session
    SECRET_KEY: Joi.string().description('secret key'),
    SESSION_SECRET: Joi.string().description('session secret'),

    /** Payment gateway */
    PAYMENT_PROVIDER: Joi.string().description('payment provider').required(),
    // stripe
    PAYMENT_SECRET_KEY: Joi.string().description('payment secret'),
    PAYMENT_WEBHOOK_SECRET: Joi.string().description('payment webhook secret'),
    PAYMENT_SUCCESS_URL: Joi.string().description('payment success url'),
    PAYMENT_CANCEL_URL: Joi.string().description('payment cancel url'),

    // google sign-in
    CLIENT_ID: Joi.string().description('client id from google sign in'),
    CLIENT_SECRET: Joi.string().description('client secret from google sign in'),
    CALLBACK_URI: Joi.string().description('callback urk from google sign in'),

    // common
    BASE_URL: Joi.string().description('base url').required(),
    IMAGE_URL: Joi.string().description('image url').required(),

    // cipher
    CIPHER_SECRET: Joi.string().description('cipher secret'),

    /** shipping carrier */
    SHIPPING_CARRIER: Joi.string().description('shipping carrier').required(),
    // shippo
    SHIPPING_API_KEY: Joi.string().description('shipping API key'),
    SHIPPING_WEBHOOK: Joi.string().description('shipping webhook'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      // useCreateIndex: true,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  paymentGateway: {
    paymentProvider: envVars.PAYMENT_PROVIDER,
    paymentSecretKey: envVars.PAYMENT_SECRET_KEY,
    paymentWebhookSecret: envVars.PAYMENT_WEBHOOK_SECRET,
    paymentSuccessUrl: envVars.PAYMENT_SUCCESS_URL,
    paymentCancelUrl: envVars.PAYMENT_CANCEL_URL,
  },
  googleSignIn: {
    clientId: envVars.CLIENT_ID,
    clientSecret: envVars.CLIENT_SECRET,
    callBackUrl: envVars.CALLBACK_URI,
  },
  common: {
    baseUrl: envVars.BASE_URL,
    imageUrl: envVars.IMAGE_URL,
  },
  crypto: {
    cipherSecret: envVars.CIPHER_SECRET,
  },
  shipping: {
    shippingCarrier : envVars.SHIPPING_CARRIER,
    shippingApiKey : envVars.SHIPPING_API_KEY,
    shippingWebhook : envVars.SHIPPING_WEBHOOK,
  }
};
