// import { createClient } from 'redis';
// const {
//   redis: { redisDatabaseUserName, redisDatabasePassword, redisDatabaseUrl, redisDatabasePort },
// } = require('../config/config');
// const logger = require('../config/logger');

// let client;
// function redisDBConnection() {
//   client = createClient({
//     username: redisDatabaseUserName,
//     password: redisDatabasePassword,
//     socket: {
//       host: redisDatabaseUrl,
//       port: redisDatabasePort,
//     },
//   });

//   client.on('error', (err) => {
//     logger.error('Redis Database not connected ❌');
//   });

//   client.connect().then(() => {
//     logger.info('Redis Database connected ✅');
//   });
// }

// module.exports = { client, redisDBConnection };
