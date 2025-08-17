export enum ACCOUNTSTATUS {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum USERROLE {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum AUTHPROVIDER {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APPLE = 'APPLE',
}

export enum USERGENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum USERLANGUAGE {
  ENGLISH = 'ENGLISH',
  GUJARATI = 'GUJARATI',
  HINDI = 'HINDI',
}

export enum USERTIMEZONES {
  UTC = 'UTC',
}

export enum USERCURRENCY {
  USD = 'USD',
  INR = 'INR',
}

export enum TOKENTYPES {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
}

export enum PAYMENTSTATUS {
  SUCCESS = 'SUCCESS',
  PAID = 'PAID',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
  REFUND_SUCCESS = 'REFUND_SUCCESS',
  REFUND_FAILED = 'REFUND_FAILED',
}

export enum SHIPPINGSTATUS {
  PENDING = 'PENDING',
}

export enum SHIPMENTTYPE {
  OUTGOING = 'OUTGOING',
  RETURN = 'RETURN',
}

export enum CONFIRMATIONTYPE {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum INVENTORYTYPE {
  IN = 'IN',
  OUT = 'OUT',
  RESERVE = 'RESERVE',
  RELEASE = 'RELEASE',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum PRODUCTSKUSTATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PAYMENTPROVIDERS {
  STRIPE = 'stripe',
}

export enum SHIPPINGCARRIERS {
  SHIPPO = 'shippo',
}

export enum FILESFOLDER {
  PUBLIC = 'public',
  TEMP = 'temp',
}

export enum QUEUES {
  NOTIFICATION_QUEUE = 'notification_queue',
}
