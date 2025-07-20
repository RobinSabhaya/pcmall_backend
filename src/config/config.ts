import dotenv from 'dotenv'
dotenv.config()

// dotenv.config({ path: path.join(__dirname, '../../.env') })

// const envVarsSchema = Joi.object()
//   .keys({
//     NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
//     PORT: Joi.number().default(3000),
//     MONGODB_URL: Joi.string().required().description('Mongo DB url'),

//     // JWT Authentication
//     JWT_SECRET: Joi.string().required().description('JWT secret key'),
//     JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
//     JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
//     JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
//       .default(10)
//       .description('minutes after which reset password token expires'),
//     JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
//       .default(10)
//       .description('minutes after which verify email token expires'),

//     // SMTP
//     SMTP_HOST: Joi.string().description('server that will send the emails'),
//     SMTP_PORT: Joi.number().description('port to connect to the email server'),
//     SMTP_USERNAME: Joi.string().description('username for email server'),
//     SMTP_PASSWORD: Joi.string().description('password for email server'),
//     EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
//     SMTP_SERVICE: Joi.string().description('smtp service'),
//     SMTP_MAIL: Joi.string().description('Nodemailer mail'),
//     EMAIL_PROVIDER: Joi.string().description('Email provider'),

//     // session
//     SECRET_KEY: Joi.string().description('secret key'),
//     SESSION_SECRET: Joi.string().description('session secret'),

//     /** Payment gateway */
//     PAYMENT_PROVIDER: Joi.string().description('payment provider').required(),
//     // stripe
//     PAYMENT_SECRET_KEY: Joi.string().description('payment secret'),
//     PAYMENT_WEBHOOK_SECRET: Joi.string().description('payment webhook secret'),
//     PAYMENT_SUCCESS_URL: Joi.string().description('payment success url'),
//     PAYMENT_CANCEL_URL: Joi.string().description('payment cancel url'),

//     // google sign-in
//     CLIENT_ID: Joi.string().description('client id from google sign in'),
//     CLIENT_SECRET: Joi.string().description('client secret from google sign in'),
//     CALLBACK_URI: Joi.string().description('callback urk from google sign in'),

//     // common
//     BASE_URL: Joi.string().description('base url').required(),
//     IMAGE_URL: Joi.string().description('image url').required(),

//     // cipher
//     CIPHER_SECRET: Joi.string().description('cipher secret'),

//     /** shipping carrier */
//     SHIPPING_CARRIER: Joi.string().description('shipping carrier').required(),
//     // shippo
//     SHIPPING_API_KEY: Joi.string().description('shipping API key'),
//     SHIPPING_WEBHOOK: Joi.string().description('shipping webhook'),

//     /** sms provider */
//     SMS_PROVIDER: Joi.string().description('shipping carrier').required(),
//     // twilio
//     TWILIO_ACCOUNT_SID: Joi.string().description('Twilio Account SID'),
//     TWILIO_AUTH_TOKEN: Joi.string().description('Twilio auth token'),
//     TWILIO_PHONE_NUMBER: Joi.string().description('Twilio phone number'),

//     /** File storage Provider */
//     FILE_STORAGE_PROVIDER: Joi.string().description('File storage provider'),
//     // minIO
//     MINIO_ENDPOINT: Joi.string().description('minIO endpoint'),
//     MINIO_PORT: Joi.string().description('minIO port'),
//     MINIO_ACCESS_KEY: Joi.string().description('minIO access key'),
//     MINIO_SECRET_KEY: Joi.string().description('minIO secret key'),
//     MINIO_BUCKET: Joi.string().description('minIO bucket'),

//     /** Redis */
//     REDIS_DATABASE_USER_NAME: Joi.string().description('Redis database user name'),
//     REDIS_DATABASE_PASSWORD: Joi.string().description('Redis database password'),
//     REDIS_DATABASE_URL: Joi.string().description('Redis database url'),
//     REDIS_DATABASE_PORT: Joi.string().description('Redis database port`'),
//   })
//   .unknown();

// const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

// if (error) {
//   throw new Error(`Config validation error: ${error.message}`);
// }

export const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    url: process.env.MONGODB_URL + (process.env.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      // useCreateIndex: true,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    emailProvider: process.env.EMAIL_PROVIDER,
    from: process.env.EMAIL_FROM,
  },
  paymentGateway: {
    paymentProvider: process.env.PAYMENT_PROVIDER,
    paymentSecretKey: process.env.PAYMENT_SECRET_KEY,
    paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET,
    paymentSuccessUrl: process.env.PAYMENT_SUCCESS_URL,
    paymentCancelUrl: process.env.PAYMENT_CANCEL_URL,
  },
  googleSignIn: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callBackUrl: process.env.CALLBACK_URI,
  },
  common: {
    baseUrl: process.env.BASE_URL,
    imageUrl: process.env.IMAGE_URL,
  },
  crypto: {
    cipherSecret: process.env.CIPHER_SECRET,
  },
  shipping: {
    shippingCarrier: process.env.SHIPPING_CARRIER,
    shippingApiKey: process.env.SHIPPING_API_KEY,
    shippingWebhook: process.env.SHIPPING_WEBHOOK,
  },
  sms: {
    smsCarrier: process.env.SMS_PROVIDER,
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    accountAuthToken: process.env.TWILIO_AUTH_TOKEN,
    accountPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  minIO: {
    fileStorageProvider: process.env.FILE_STORAGE_PROVIDER,
    minIOEndpoint: process.env.MINIO_ENDPOINT,
    minIOPort: process.env.MINIO_PORT,
    minIOAccessKey: process.env.MINIO_ACCESS_KEY,
    minIOSecretKey: process.env.MINIO_SECRET_KEY,
    minIOBucket: process.env.MINIO_BUCKET,
  },
  redis: {
    redisDatabaseUserName: process.env.REDIS_DATABASE_USER_NAME,
    redisDatabasePassword: process.env.REDIS_DATABASE_PASSWORD,
    redisDatabaseUrl: process.env.REDIS_DATABASE_URL,
    redisDatabasePort: process.env.REDIS_DATABASE_PORT,
  },
};
