const bunyan = require('bunyan');

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Error logger
 * @param error
 */
function logError(error) {
  const logger = bunyan.createLogger({
    name: error.name,
    streams: [
      {
        level: 'error',
        path: 'error.log',
      },
    ],
  });
  logger.error(error);
}

module.exports = {
  logError,
  emailRegExp,
};
