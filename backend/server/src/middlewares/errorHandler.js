// catches every thrown error/rejected promise so no route needs its own try/catch response logic
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong on our end';

  if (!err.isOperational) {
    logger.error(err.message, err.stack);
  }

  res.status(statusCode).json({ success: false, message });
}

// wraps async route handlers so thrown errors go straight to errorHandler instead of hanging the request
function catchAsync(routeHandler) {
  return function wrappedHandler(req, res, next) {
    routeHandler(req, res, next).catch(next);
  };
}

module.exports = { errorHandler, catchAsync };
