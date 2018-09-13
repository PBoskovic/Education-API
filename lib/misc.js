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

/**
 * Return custom short ID with 6 digits
 * @param {Number} idLength length of the ID
 * @returns {string}
 */
function customShortId(idLength = 6) {
  const numbers = '0123456789';
  let data = '';
  for (let i = 0; i < idLength; i += 1) {
    data += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return data;
}

module.exports = {
  logError,
  emailRegExp,
  customShortId,
};
