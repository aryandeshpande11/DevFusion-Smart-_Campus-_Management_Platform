// small wrapper around jsonwebtoken so the rest of the app never touches jwt directly
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function createAccessToken(userId) {
  return jwt.sign({ userId }, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiry });
}

function createRefreshToken(userId) {
  return jwt.sign({ userId }, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiry });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

function createEmailToken(userId) {
  return jwt.sign({ userId }, env.emailTokenSecret, { expiresIn: '24h' });
}

function verifyEmailToken(token) {
  return jwt.verify(token, env.emailTokenSecret);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  createEmailToken,
  verifyEmailToken,
};
