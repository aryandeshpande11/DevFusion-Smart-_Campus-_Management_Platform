// business logic for per-user preferences and the danger-zone account deletion
const db = require('../config/db');

// upserts because a brand-new user might not have a settings row yet.
// Using upsert (not find-then-create) matters here: the dashboard fires
// several requests on load, so two concurrent calls could both find no
// existing row and both try to create one, tripping the unique constraint
// on user_id. Upsert makes that race safe.
async function getUserSettings(userId) {
  return db.settings.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
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
