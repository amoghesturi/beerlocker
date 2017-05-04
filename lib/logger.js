const winston = require('winston');

const level = 'debug';
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ timestamp: true, level }),
  ],
});

module.exports = logger;
