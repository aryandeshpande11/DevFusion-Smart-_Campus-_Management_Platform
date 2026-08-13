// business logic for per-user preferences and the danger-zone account deletion
const db = require('../config/db');

// upserts because a brand-new user might not have a settings row yet
async function getUserSettings(userId) {
  const existingSettings = await db.settings.findUnique({ where: { userId } });
  if (existingSettings) return existingSettings;

  return db.settings.create({ data: { userId } });
}

async function updateUserSettings(userId, updates) {
  return db.settings.upsert({
    where: { userId },
    update: updates,
    create: { userId, ...updates },
  });
}

async function linkGoogleAccount(userId, googleId) {
  return db.user.update({ where: { id: userId }, data: { googleId } });
}

async function deleteOwnAccount(userId) {
  await db.user.delete({ where: { id: userId } });
}

module.exports = { getUserSettings, updateUserSettings, linkGoogleAccount, deleteOwnAccount };
