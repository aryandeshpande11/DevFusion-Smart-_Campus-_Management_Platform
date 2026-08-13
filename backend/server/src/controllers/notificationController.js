const notificationService = require('../services/notificationService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');

const getMyNotifications = catchAsync(async function handleGetMyNotifications(req, res) {
  const notifications = await notificationService.getMyNotifications(req.currentUser.id);
  return sendSuccess(res, 200, 'Notifications fetched', { notifications });
});

const markAsRead = catchAsync(async function handleMarkAsRead(req, res) {
  const notification = await notificationService.markNotificationAsRead(req.params.id);
  return sendSuccess(res, 200, 'Notification marked as read', { notification });
});

const markAllAsRead = catchAsync(async function handleMarkAllAsRead(req, res) {
  await notificationService.markAllNotificationsAsRead(req.currentUser.id);
  return sendSuccess(res, 200, 'All notifications marked as read');
});

const deleteNotification = catchAsync(async function handleDeleteNotification(req, res) {
  await notificationService.deleteNotification(req.params.id);
  return sendSuccess(res, 200, 'Notification deleted');
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };
