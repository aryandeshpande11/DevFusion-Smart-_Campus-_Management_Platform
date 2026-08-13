// separate from authController since it deals with passport's req.user instead of req.body
const authService = require('../services/authService');
const env = require('../config/env');

const handleGoogleCallback = async function handleGoogleCallback(req, res) {
  const googleUser = req.user;
  const { accessToken, refreshToken } = await authService.issueTokenPairForUser(googleUser.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // hand the access token back to the frontend via a redirect with query param
  res.redirect(`${env.clientUrl}/oauth-success?accessToken=${accessToken}`);
};

module.exports = { handleGoogleCallback };
