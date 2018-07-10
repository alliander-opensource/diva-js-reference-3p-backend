const log4js = require('log4js');
const { logLevel } = require('./../config');

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: logLevel },
    actions: { appenders: ['out'], level: logLevel },
    session: { appenders: ['out'], level: logLevel },
    eanIssue: { appenders: ['out'], level: logLevel },
  },
});

function getLogger(appender) {
  return log4js.getLogger(appender);
}

module.exports = getLogger;
