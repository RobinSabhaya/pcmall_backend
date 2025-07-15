const { Worker, Queue } = require('bullmq');
const {
  redis: { redisDatabaseUserName, redisDatabasePassword, redisDatabaseUrl, redisDatabasePort },
} = require('../config/config');
const paymentService = require('../services/payment/payment.service');
const { QUEUES } = require('../helpers/constant.helper');

const connection = {
  username: redisDatabaseUserName,
  password: redisDatabasePassword,
  host: redisDatabaseUrl,
  port: redisDatabasePort,
};

// Worker
new Worker(
  QUEUES.NOTIFICATION_QUEUE,
  async (job) => {
    if (job?.data) {
      const { userData, userProfileData, order } = job.data;

      switch (job?.data?.type) {
        case 'sms':
          await paymentService.orderConfirmationSMS({ userData, userProfileData, order });
          break;

        case 'email':
          await paymentService.orderConfirmationEmail({ userData, userProfileData, order });
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
const notificationQueue = new Queue(QUEUES.NOTIFICATION_QUEUE, {
  connection,
});

module.exports = {
  notificationQueue,
};
