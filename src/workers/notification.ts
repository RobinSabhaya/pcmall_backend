import { Worker, Queue } from 'bullmq';

import { config } from '@/config/config';
import { QUEUES } from '@/helpers/constant.helper';

import * as paymentService from '../services/payment/payment.service';

const {
  redis: {
    redisDatabaseUserName,
    redisDatabasePassword,
    redisDatabaseUrl,
    redisDatabasePort,
  },
} = config;

const connection = {
  username: redisDatabaseUserName!,
  password: redisDatabasePassword!,
  host: redisDatabaseUrl!,
  port: +redisDatabasePort!,
};

// Worker
new Worker(
  QUEUES.NOTIFICATION_QUEUE,
  async job => {
    if (job?.data !== null) {
      const { userData, userProfileData, order } = job.data;

      switch (job?.data?.type) {
        case 'sms':
          await paymentService.orderConfirmationSMS({
            userData,
            userProfileData,
            order,
          });
          break;

        case 'email':
          await paymentService.orderConfirmationEmail({
            userData,
            userProfileData,
            order,
          });
          break;

        default:
          break;
      }
    }
  },
  {
    connection,
  }
);

// Queue
export const notificationQueue = new Queue(QUEUES.NOTIFICATION_QUEUE, {
  connection,
});
