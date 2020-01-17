const { name } = require('../../../package.json');
const environments = require('../../environments');

const PROJECT_NAME = name
  .toLowerCase()
  .trim()
  .replace(/[^A-Z0-9]+/ig, '_'); // Remove whitespace and symbols

/**
 * Return mongodb connection
 * @returns {String}
 */
module.exports.connectionString = () => {
  switch (environments.NODE_ENV) {
    case 'production':
      return `mongodb://${environments.MONGO_USERNAME}:${environments.MONGO_PASSWORD}@${environments.MONGO_HOSTNAME}:${environments.MONGO_PORT}/${PROJECT_NAME}_prod`;
    case 'test':
      return `mongodb://${environments.MONGO_USERNAME}:${environments.MONGO_PASSWORD}@${environments.MONGO_HOSTNAME}:${environments.MONGO_PORT}/${PROJECT_NAME}_test`;
    default:
      return `mongodb://${environments.MONGO_USERNAME}:${environments.MONGO_PASSWORD}@${environments.MONGO_HOSTNAME}:${environments.MONGO_PORT}/${PROJECT_NAME}_dev`;
  }
};
