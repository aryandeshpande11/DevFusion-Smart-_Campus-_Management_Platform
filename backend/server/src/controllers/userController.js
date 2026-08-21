const userService = require('../services/userService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');

const getMyProfile = catchAsync(async function handleGetMyProfile(req, res) {
  const user = await userService.getUserProfile(req.currentUser.id);
  return sendSuccess(res, 200, 'Profile fetched', { user });
});

const updateMyProfile = catchAsync(async function handleUpdateMyProfile(req, res) {
  const updatedUser = await userService.updateOwnProfile(req.currentUser.id, req.body);
  return sendSuccess(res, 200, 'Profile updated', { user: updatedUser });
});

const uploadMyAvatar = catchAsync(async function handleUploadAvatar(req, res) {
  const updatedUser = await userService.uploadUserAvatar(req.currentUser.id, req.file.buffer);
  return sendSuccess(res, 200, 'Avatar updated', { avatarUrl: updatedUser.avatarUrl });
});

const uploadMyResume = catchAsync(async function handleUploadResume(req, res) {
  const updatedUser = await userService.uploadUserResume(req.currentUser.id, req.file.buffer);
  return sendSuccess(res, 200, 'Resume uploaded', { resumeUrl: updatedUser.resumeUrl });
});

const listUsers = catchAsync(async function handleListUsers(req, res) {
  const users = await userService.listAllUsers(req.query);
  return sendSuccess(res, 200, 'Users fetched', { users });
});

const getUserById = catchAsync(async function handleGetUserById(req, res) {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, 200, 'User fetched', { user });
});

const listRoles = catchAsync(async function handleListRoles(req, res) {
  const roles = await userService.listRoles();
  return sendSuccess(res, 200, 'Roles fetched', { roles });
});

const updateUserRole = catchAsync(async function handleUpdateUserRole(req, res) {
  const updatedUser = await userService.changeUserRole(req.params.id, req.body.roleId);
  return sendSuccess(res, 200, 'Role updated', { user: updatedUser });
});

const updateUserStatus = catchAsync(async function handleUpdateUserStatus(req, res) {
  const updatedUser = await userService.toggleUserActiveStatus(req.params.id, req.body.isActive);
  return sendSuccess(res, 200, 'Status updated', { user: updatedUser });
});

// lets admin/coordinator fix a student's department + semester after the fact —
// e.g. if they picked the wrong one at signup or it was never set
const updateUserAcademicInfo = catchAsync(async function handleUpdateUserAcademicInfo(req, res) {
  const updatedUser = await userService.updateUserAcademicInfo(req.params.id, req.body);
  return sendSuccess(res, 200, 'Academic info updated', { user: updatedUser });
});

const deleteUser = catchAsync(async function handleDeleteUser(req, res) {
  await userService.deleteUserAccount(req.params.id);
  return sendSuccess(res, 200, 'User deleted');
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  uploadMyResume,
  listUsers,
  getUserById,
  listRoles,
  updateUserRole,
  updateUserStatus,
  updateUserAcademicInfo,
  deleteUser,
};