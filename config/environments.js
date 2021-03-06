const path = require('path');

const envPath = path.join(__dirname, `./environments/${process.env.NODE_ENV}.env`);
require('dotenv')
  .config({ path: envPath });

/*
 * Project enviroment variables
 */
const environmentVariables = {
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_HOSTNAME: process.env.MONGO_HOSTNAME,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB: process.env.MONGO_DB
};

/**
 * Returns Project environment variables based on NODE_ENV
 * @returns {Object}
 */
const getEnvVariables = () => {
  if (!environmentVariables.NODE_ENV) {
    throw new Error('Missing NODE_ENV environment variable');
  }

  if (environmentVariables.NODE_ENV === 'production') {
    return environmentVariables;
  }

  return {
    NODE_ENV: environmentVariables.NODE_ENV,
    PORT: environmentVariables.PORT,
    JWT_SECRET: environmentVariables.JWT_SECRET,
    MONGO_USERNAME: environmentVariables.MONGO_USERNAME,
    MONGO_PASSWORD: environmentVariables.MONGO_PASSWORD,
    MONGO_HOSTNAME: environmentVariables.MONGO_HOSTNAME,
    MONGO_PORT: environmentVariables.MONGO_PORT,
    MONGO_DB: environmentVariables.MONGO_DB
  };
};

// Check for missing environment variables
Object
  .entries(getEnvVariables())
  .forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing ${key} environment variable`);
    }
  });

module.exports = getEnvVariables();
