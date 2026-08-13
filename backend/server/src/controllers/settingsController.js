const settingsService = require('../services/settingsService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');

const getSettings = catchAsync(async function handleGetSettings(req, res) {
  const settings = await settingsService.getUserSettings(req.currentUser.id);
  return sendSuccess(res, 200, 'Settings fetched', { settings });
});

const updateSettings = catchAsync(async function handleUpdateSettings(req, res) {
  const settings = await settingsService.updateUserSettings(req.currentUser.id, req.body);
  return sendSuccess(res, 200, 'Settings updated', { settings });
});

const connectGoogleAccount = catchAsync(async function handleConnectGoogleAccount(req, res) {
  const user = await settingsService.linkGoogleAccount(req.currentUser.id, req.body.googleId);
  return sendSuccess(res, 200, 'Google account connected', { user });
});

const deleteMyAccount = catchAsync(async function handleDeleteMyAccount(req, res) {
  await settingsService.deleteOwnAccount(req.currentUser.id);
  res.clearCookie('refreshToken');
  return sendSuccess(res, 200, 'Account deleted');
});

module.exports = { getSettings, updateSettings, connectGoogleAccount, deleteMyAccount };
