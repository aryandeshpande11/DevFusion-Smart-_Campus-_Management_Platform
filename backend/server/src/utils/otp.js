// handles 6-digit otp creation, storage in redis with ttl, and verification for forgot-password flow
const redisClient = require('../config/redis');

const OTP_TTL_SECONDS = 5 * 60;

function generateSixDigitOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function saveOtpForEmail(email, otp) {
  await redisClient.set(`otp:${email}`, otp, 'EX', OTP_TTL_SECONDS);
}

async function checkOtpMatches(email, otp) {
  const savedOtp = await redisClient.get(`otp:${email}`);
  return savedOtp === otp;
}

async function clearOtpForEmail(email) {
  await redisClient.del(`otp:${email}`);
}

module.exports = { generateSixDigitOtp, saveOtpForEmail, checkOtpMatches, clearOtpForEmail };
