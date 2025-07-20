// import { ExpressAdapter } from '@bull-board/express';
// import { createBullBoard } from '@bull-board/api';
// import bullMQAdapter from '@bull-board/api/bullMQAdapter'
// import { notificationQueue } from '../workers';

// const queues = [];
// const queueList = [notificationQueue.notificationQueue];

// for (let i = 0; i < queueList.length; i++) {
//   queues.push(new bullMQAdapter(queueList[i]));
// }

// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath('/admin/queues');

// createBullBoard({
//   queues,
//   serverAdapter,
// });

// module.exports = serverAdapter;
