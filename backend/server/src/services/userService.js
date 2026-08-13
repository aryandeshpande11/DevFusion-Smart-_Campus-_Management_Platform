// business logic for profile management and admin-level user operations
const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/appError');

async function getUserProfile(userId) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { role: true, department: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

// only allows a safe subset of fields to be self-edited
async function updateOwnProfile(userId, updates) {
  const allowedFields = ['name', 'phone', 'bio', 'skills', 'linkedinUrl', 'githubUrl', 'semester', 'departmentId'];
  const safeUpdates = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) safeUpdates[field] = updates[field];
  }

  return db.user.update({ where: { id: userId }, data: safeUpdates });
}

// uploads a buffer to cloudinary and saves the resulting url on the user
async function uploadUserAvatar(userId, fileBuffer) {
  const uploadResult = await uploadBufferToCloudinary(fileBuffer, 'campus/avatars');
  return db.user.update({ where: { id: userId }, data: { avatarUrl: uploadResult.secure_url } });
}

async function uploadUserResume(userId, fileBuffer) {
  const uploadResult = await uploadBufferToCloudinary(fileBuffer, 'campus/resumes');
  return db.user.update({ where: { id: userId }, data: { resumeUrl: uploadResult.secure_url } });
}

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

async function listAllUsers(filters = {}) {
  const { roleId, departmentId, search } = filters;
  return db.user.findMany({
    where: {
      ...(roleId && { roleId }),
      ...(departmentId && { departmentId }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    },
    include: { role: true, department: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getUserById(userId) {
  const user = await db.user.findUnique({ where: { id: userId }, include: { role: true, department: true } });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

async function changeUserRole(userId, newRoleId) {
  return db.user.update({ where: { id: userId }, data: { roleId: newRoleId } });
}

async function toggleUserActiveStatus(userId, isActive) {
  return db.user.update({ where: { id: userId }, data: { isActive } });
}

async function deleteUserAccount(userId) {
  await db.user.delete({ where: { id: userId } });
}

module.exports = {
  getUserProfile,
  updateOwnProfile,
  uploadUserAvatar,
  uploadUserResume,
  listAllUsers,
  getUserById,
  changeUserRole,
  toggleUserActiveStatus,
  deleteUserAccount,
};
