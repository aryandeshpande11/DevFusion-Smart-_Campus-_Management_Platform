// business logic for in-app notifications, paired with socket emits for real-time delivery
const db = require('../config/db');

// used internally by other services (e.g. when a submission is reviewed) to notify a user
async function createNotification(userId, { type, title, message, link }) {
  return db.notification.create({ data: { userId, type, title, message, link } });
}

async function getMyNotifications(userId) {
  return db.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

async function markNotificationAsRead(notificationId) {
  return db.notification.update({ where: { id: notificationId }, data: { isRead: true } });
}

async function markAllNotificationsAsRead(userId) {
  await db.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
}

async function deleteNotification(notificationId) {
  await db.notification.delete({ where: { id: notificationId } });
}

module.exports = {
  createNotification,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
