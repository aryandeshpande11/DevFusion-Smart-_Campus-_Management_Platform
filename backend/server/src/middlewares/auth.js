// checks the access token on protected routes and attaches the logged-in user to req.currentUser
const { verifyAccessToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const db = require('../config/db');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return sendError(res, 401, 'You must be logged in to do that');
    }

    const decoded = verifyAccessToken(token);

    const loggedInUser = await db.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!loggedInUser || !loggedInUser.isActive) {
      return sendError(res, 401, 'This account is no longer active');
    }

    req.currentUser = loggedInUser;
    next();
  } catch (error) {
    return sendError(res, 401, 'Session expired, please log in again');
  }
}

module.exports = requireAuth;
