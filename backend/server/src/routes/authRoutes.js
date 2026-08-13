const express = require('express');
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const { handleGoogleCallback } = require('../controllers/googleAuthController');
const requireAuth = require('../middlewares/auth');
const validateBody = require('../middlewares/validate');
const { authRateLimiter } = require('../middlewares/rateLimit');
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} = require('../validators/authValidator');

const router = express.Router();

// email + password flow
router.post('/signup', authRateLimiter, validateBody(signupSchema), authController.signup);
router.post('/login', authRateLimiter, validateBody(loginSchema), authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authRateLimiter, authController.resendVerification);

// forgot password via otp
router.post('/forgot-password', authRateLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-otp', authRateLimiter, validateBody(verifyOtpSchema), authController.verifyOtp);
router.post('/reset-password', authRateLimiter, validateBody(resetPasswordSchema), authController.resetPassword);

// google oauth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false }), handleGoogleCallback);

// token + session
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getCurrentUser);

module.exports = router;
