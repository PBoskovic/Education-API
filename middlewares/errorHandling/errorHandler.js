const errorMessage = require('./errorConstants');
const environments = require('../../config/environments');
const { logError } = require('../../lib/misc');

module.exports = () => (err, req, res, next) => {
  const error = {};

  switch (err.message) {
    case errorMessage.AUTHORIZATION_TOKEN:
      error.message = 'No authorization token was found';
      error.status = 401;
      error.errorCode = 1;
      break;
    case errorMessage.MISSING_PARAMETERS:
      error.message = 'Missing parameters';
      error.status = 400;
      error.errorCode = 2;
      break;
    case errorMessage.NOT_ACCEPTABLE:
      error.status = 406;
      error.message = 'Not acceptable';
      error.errorCode = 3;
      break;
    case errorMessage.NOT_FOUND:
      error.status = 404;
      error.message = 'Not Found';
      error.errorCode = 4;
      break;
    case errorMessage.FORBIDDEN:
      error.status = 403;
      error.message = 'Insufficient privileges';
      error.errorCode = 5;
      break;
    case errorMessage.CREDENTIALS_ERROR:
      error.status = 401;
      error.message = 'Wrong credentials';
      error.errorCode = 6;
      break;
    case errorMessage.UNAUTHORIZED_ERROR:
      error.status = 401;
      error.message = 'Invalid credentials';
      error.errorCode = 7;
      break;
    default:
      error.status = 500;
      error.message = 'Oops, an error occurred';
      error.errorCode = 0;
  }

  if (error.status === 500) {
    logError(err);
  }

  if (environments.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  return res
    .status(error.status)
    .send(error);
};
