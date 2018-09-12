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
