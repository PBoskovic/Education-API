const bunyan = require('bunyan');

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
};
