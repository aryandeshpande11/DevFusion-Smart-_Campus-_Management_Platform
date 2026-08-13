// throttles sensitive endpoints like auth and uploads to slow down brute force / abuse
const rateLimit = require('express-rate-limit');

const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many attempts, please try again in a minute' },
});

const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many uploads, please slow down' },
});

module.exports = { authRateLimiter, uploadRateLimiter };
