// all the actual auth business logic lives here, controllers just call these functions
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const redisClient = require('../config/redis');
const AppError = require('../utils/appError');
const { createAccessToken, createRefreshToken, createEmailToken, verifyEmailToken, verifyRefreshToken } = require('../utils/jwt');
const { generateSixDigitOtp, saveOtpForEmail, checkOtpMatches, clearOtpForEmail } = require('../utils/otp');
const { sendVerificationEmail, sendOtpEmail } = require('../utils/mailer');
const env = require('../config/env');

const SALT_ROUNDS = 12;

// creates a new user with hashed password and fires off the verification email
async function signupNewUser({ name, email, password, roleId }) {
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const defaultRole = roleId ? { id: roleId } : await db.role.findUnique({ where: { name: 'student' } });

  const newUser = await db.user.create({
    data: { name, email, passwordHash, roleId: defaultRole.id },
  });

  const emailToken = createEmailToken(newUser.id);
  const verifyLink = `${env.clientUrl}/verify-email?token=${emailToken}`;
  await sendVerificationEmail(email, verifyLink);

  return newUser;
}

// checks email/password combo and returns the user if valid
async function loginWithEmailPassword(email, password) {
  const user = await db.user.findUnique({ where: { email }, include: { role: true } });

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated', 403);
  }

  return user;
}

// issues a fresh access + refresh token pair and stores the refresh token hash in redis for revocation
async function issueTokenPairForUser(userId) {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  await redisClient.set(`refreshToken:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

  return { accessToken, refreshToken };
}

// rotates the refresh token - old one is invalidated, a new pair is issued
async function rotateRefreshToken(oldRefreshToken) {
  const decoded = verifyRefreshToken(oldRefreshToken);
  const savedToken = await redisClient.get(`refreshToken:${decoded.userId}`);

  if (savedToken !== oldRefreshToken) {
    throw new AppError('Session expired, please log in again', 401);
  }

  return issueTokenPairForUser(decoded.userId);
}

async function logoutUser(userId) {
  await redisClient.del(`refreshToken:${userId}`);
}

// confirms the signed token from the verification email and flips is_email_verified on
async function verifyUserEmail(token) {
  const decoded = verifyEmailToken(token);

  const updatedUser = await db.user.update({
    where: { id: decoded.userId },
    data: { isEmailVerified: true },
  });

  return updatedUser;
}

async function resendVerificationEmail(email) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new AppError('No account found with this email', 404);
  if (user.isEmailVerified) throw new AppError('This email is already verified', 400);

  const emailToken = createEmailToken(user.id);
  const verifyLink = `${env.clientUrl}/verify-email?token=${emailToken}`;
  await sendVerificationEmail(email, verifyLink);
}

// generates a fresh otp, saves it in redis, and emails it to the user
async function sendPasswordResetOtp(email) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new AppError('No account found with this email', 404);

  const otp = generateSixDigitOtp();
  await saveOtpForEmail(email, otp);
  await sendOtpEmail(email, otp);
}

async function verifyPasswordResetOtp(email, otp) {
  const isValid = await checkOtpMatches(email, otp);
  if (!isValid) throw new AppError('Invalid or expired OTP', 400);
  return true;
}

// confirms otp again then overwrites the password hash
async function resetPasswordWithOtp(email, otp, newPassword) {
  const isValid = await checkOtpMatches(email, otp);
  if (!isValid) throw new AppError('Invalid or expired OTP', 400);

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.user.update({ where: { email }, data: { passwordHash } });
  await clearOtpForEmail(email);
}

module.exports = {
  signupNewUser,
  loginWithEmailPassword,
  issueTokenPairForUser,
  rotateRefreshToken,
  logoutUser,
  verifyUserEmail,
  resendVerificationEmail,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp,
};
