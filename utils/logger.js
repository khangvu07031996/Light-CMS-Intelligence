const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
  filename: './logs/log',
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  prettyPrint: false,
  json: false,
  level: process.env.ENV === 'development' ? 'error' : 'info',
});

const logger = new (winston.Logger)({
  transports: [
    transport,
  ],
});

module.exports = {
  errorlog: logger,
};
