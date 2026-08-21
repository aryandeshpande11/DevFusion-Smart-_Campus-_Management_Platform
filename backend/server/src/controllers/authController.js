// thin layer - just pulls data off req, calls the service, sends the response
const authService = require('../services/authService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { sanitizeUser } = require('../utils/sanitizeUser');

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // frontend (vercel.app) and backend (onrender.com) are different domains,
  // so this is a cross-site request from the browser's point of view —
  // SameSite=Lax silently drops the cookie in that case. 'none' is required
  // for cross-site cookies, and browsers only honor it when secure:true,
  // which is already set above in production.
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signup = catchAsync(async function handleSignup(req, res) {
  const newUser = await authService.signupNewUser(req.body);
  return sendSuccess(res, 201, 'Account created, please check your email to verify', { userId: newUser.id });
});

const login = catchAsync(async function handleLogin(req, res) {
  const { email, password } = req.body;
  const user = await authService.loginWithEmailPassword(email, password);
  const { accessToken, refreshToken } = await authService.issueTokenPairForUser(user.id);

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  return sendSuccess(res, 200, 'Logged in successfully', { accessToken, user: sanitizeUser(user) });
});

const refreshToken = catchAsync(async function handleRefreshToken(req, res) {
  const oldRefreshToken = req.cookies?.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } = await authService.rotateRefreshToken(oldRefreshToken);

  res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);
  return sendSuccess(res, 200, 'Token refreshed', { accessToken });
});

const logout = catchAsync(async function handleLogout(req, res) {
  await authService.logoutUser(req.currentUser.id);
  res.clearCookie('refreshToken');
  return sendSuccess(res, 200, 'Logged out successfully');
});

const verifyEmail = catchAsync(async function handleVerifyEmail(req, res) {
  await authService.verifyUserEmail(req.body.token);
  return sendSuccess(res, 200, 'Email verified successfully');
});

const resendVerification = catchAsync(async function handleResendVerification(req, res) {
  await authService.resendVerificationEmail(req.body.email);
  return sendSuccess(res, 200, 'Verification email sent');
});

const forgotPassword = catchAsync(async function handleForgotPassword(req, res) {
  await authService.sendPasswordResetOtp(req.body.email);
  return sendSuccess(res, 200, 'OTP sent to your email');
});

const verifyOtp = catchAsync(async function handleVerifyOtp(req, res) {
  await authService.verifyPasswordResetOtp(req.body.email, req.body.otp);
  return sendSuccess(res, 200, 'OTP verified');
});

const resetPassword = catchAsync(async function handleResetPassword(req, res) {
  const { email, otp, newPassword } = req.body;
  await authService.resetPasswordWithOtp(email, otp, newPassword);
  return sendSuccess(res, 200, 'Password reset successfully');
});

const getCurrentUser = catchAsync(async function handleGetCurrentUser(req, res) {
  return sendSuccess(res, 200, 'Current user fetched', { user: sanitizeUser(req.currentUser) });
});

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getCurrentUser,
};