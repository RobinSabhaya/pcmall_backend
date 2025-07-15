const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const bullMQAdapter = require('@bull-board/api/bullMQAdapter').BullMQAdapter;
const { notificationQueue } = require('../workers');

const queues = [];
const queueList = [notificationQueue.notificationQueue];

for (let i = 0; i < queueList.length; i++) {
  queues.push(new bullMQAdapter(queueList[i]));
}

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues,
  serverAdapter,
});

module.exports = serverAdapter;
