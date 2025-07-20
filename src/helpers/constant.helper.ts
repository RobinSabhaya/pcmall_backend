export enum ACCOUNT_STATUS {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
};

export enum USER_ROLE {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
};

export enum AUTH_PROVIDER {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APPLE = 'APPLE',
};

export enum USER_GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
};

export enum USER_LANGUAGE {
  ENGLISH = 'ENGLISH',
  GUJARATI = 'GUJARATI',
  HINDI = 'HINDI',
};

export enum USER_TIMEZONES {
  UTC = 'UTC',
};

export enum USER_CURRENCY {
  USD = 'USD',
  INR = 'INR',
};

export enum TOKEN_TYPES {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
};

export enum PAYMENT_STATUS {
  SUCCESS = 'SUCCESS',
  PAID = 'PAID',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
};

export enum SHIPPING_STATUS {
  PENDING = 'PENDING',
};

export enum SHIPMENT_TYPE {
  OUTGOING = 'OUTGOING',
  RETURN = 'RETURN',
};

export enum CONFIRMATION_TYPE {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
};

export enum INVENTORY_TYPE {
  IN = 'IN',
  OUT = 'OUT',
  RESERVE = 'RESERVE',
  RELEASE = 'RELEASE',
  ADJUSTMENT = 'ADJUSTMENT',
};

export enum PRODUCT_SKU_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
};

export enum PAYMENT_PROVIDERS {
  STRIPE = 'stripe',
};

export enum SHIPPING_CARRIERS {
  SHIPPO = 'shippo',
};

export enum FILES_FOLDER {
  PUBLIC = 'public',
  TEMP = 'temp',
};

export enum QUEUES {
  NOTIFICATION_QUEUE = 'notification_queue',
};