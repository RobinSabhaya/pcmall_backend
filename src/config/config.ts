import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Zod schema for environment variables
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGODB_URL: z.string(),

  // JWT Authentication
  JWT_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(30),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number().default(10),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce.number().default(10),

  // SMTP
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  SMTP_SERVICE: z.string().optional(),
  SMTP_MAIL: z.string().optional(),
  EMAIL_PROVIDER: z.string().optional(),

  // Session
  SECRET_KEY: z.string().optional(),
  SESSION_SECRET: z.string().optional(),

  /** Payment Gateway */
  PAYMENT_PROVIDER: z.string(),
  PAYMENT_SECRET_KEY: z.string().optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  PAYMENT_SUCCESS_URL: z.string().optional(),
  PAYMENT_CANCEL_URL: z.string().optional(),

  // Google Sign-in
  CLIENT_ID: z.string().optional(),
  CLIENT_SECRET: z.string().optional(),
  CALLBACK_URI: z.string().optional(),

  // Common
  BASE_URL: z.string(),
  IMAGE_URL: z.string(),

  // Cipher
  CIPHER_SECRET: z.string().optional(),

  /** Shipping Carrier */
  SHIPPING_CARRIER: z.string(),
  SHIPPING_API_KEY: z.string().optional(),
  SHIPPING_WEBHOOK: z.string().optional(),

  /** SMS Provider */
  SMS_PROVIDER: z.string(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  /** File Storage Provider */
  FILE_STORAGE_PROVIDER: z.string().optional(),
  MINIO_ENDPOINT: z.string().optional(),
  MINIO_PORT: z.string().optional(),
  MINIO_ACCESS_KEY: z.string().optional(),
  MINIO_SECRET_KEY: z.string().optional(),
  MINIO_BUCKET: z.string().optional(),

  /** Redis */
  REDIS_DATABASE_USER_NAME: z.string().optional(),
  REDIS_DATABASE_PASSWORD: z.string().optional(),
  REDIS_DATABASE_URL: z.string().optional(),
  REDIS_DATABASE_PORT: z.string().optional(),
});

// Validate environment variables
const env = envSchema.parse(process.env);

/**
 * Config object with types inferred from Zod schema
 */
export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongoose: {
    url: env.MONGODB_URL + (env.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  jwt: {
    secret: env.JWT_SECRET,
    accessExpirationMinutes: env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      service: env.SMTP_SERVICE,
      auth: {
        user: env.SMTP_USERNAME,
        pass: env.SMTP_PASSWORD,
      },
    },
    emailProvider: env.EMAIL_PROVIDER,
    from: env.EMAIL_FROM,
  },
  paymentGateway: {
    paymentProvider: env.PAYMENT_PROVIDER,
    paymentSecretKey: env.PAYMENT_SECRET_KEY,
    paymentWebhookSecret: env.PAYMENT_WEBHOOK_SECRET,
    paymentSuccessUrl: env.PAYMENT_SUCCESS_URL,
    paymentCancelUrl: env.PAYMENT_CANCEL_URL,
  },
  googleSignIn: {
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    callBackUrl: env.CALLBACK_URI,
  },
  common: {
    baseUrl: env.BASE_URL,
    imageUrl: env.IMAGE_URL,
  },
  crypto: {
    cipherSecret: env.CIPHER_SECRET,
  },
  shipping: {
    shippingCarrier: env.SHIPPING_CARRIER,
    shippingApiKey: env.SHIPPING_API_KEY,
    shippingWebhook: env.SHIPPING_WEBHOOK,
  },
  sms: {
    smsCarrier: env.SMS_PROVIDER,
    accountSid: env.TWILIO_ACCOUNT_SID,
    accountAuthToken: env.TWILIO_AUTH_TOKEN,
    accountPhoneNumber: env.TWILIO_PHONE_NUMBER,
  },
  minIO: {
    fileStorageProvider: env.FILE_STORAGE_PROVIDER,
    minIOEndpoint: env.MINIO_ENDPOINT,
    minIOPort: env.MINIO_PORT,
    minIOAccessKey: env.MINIO_ACCESS_KEY,
    minIOSecretKey: env.MINIO_SECRET_KEY,
    minIOBucket: env.MINIO_BUCKET,
  },
  redis: {
    redisDatabaseUserName: env.REDIS_DATABASE_USER_NAME,
    redisDatabasePassword: env.REDIS_DATABASE_PASSWORD,
    redisDatabaseUrl: env.REDIS_DATABASE_URL,
    redisDatabasePort: env.REDIS_DATABASE_PORT,
  },
} as const;

export type Config = typeof config;
