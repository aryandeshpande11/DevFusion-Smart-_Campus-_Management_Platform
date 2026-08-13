const noticeService = require('../services/noticeService');
const notificationService = require('../services/notificationService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { emitNotificationToUser } = require('../sockets/socketHandlers');

const createNotice = catchAsync(async function handleCreateNotice(req, res) {
  const notice = await noticeService.createNotice(req.currentUser.id, req.body);

  const targetedUsers = await noticeService.getUsersMatchingNoticeTarget(req.body);
  const io = req.app.get('io');
  for (const user of targetedUsers) {
    const notification = await notificationService.createNotification(user.id, {
      type: 'notice',
      title: 'New notice',
      message: notice.title,
      link: `/app/notices`,
    });
    emitNotificationToUser(io, user.id, notification);
  }

  return sendSuccess(res, 201, 'Notice posted', { notice });
});

const getNotices = catchAsync(async function handleGetNotices(req, res) {
  const notices = await noticeService.getNoticesForUser(req.currentUser);
  return sendSuccess(res, 200, 'Notices fetched', { notices });
});

const deleteNotice = catchAsync(async function handleDeleteNotice(req, res) {
  await noticeService.deleteNotice(req.params.id);
  return sendSuccess(res, 200, 'Notice deleted');
});

module.exports = { createNotice, getNotices, deleteNotice };
