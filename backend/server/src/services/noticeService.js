// business logic for posting and fetching announcements, filtered by the viewer's role/department
const db = require('../config/db');

async function createNotice(creatorId, { title, content, targetRole, targetDepartment }) {
  return db.notice.create({ data: { title, content, targetRole, targetDepartment, createdBy: creatorId } });
}

// finds every user who should receive an in-app notification for a newly posted notice
// (mirrors the same targeting rules used to filter the notice feed itself)
async function getUsersMatchingNoticeTarget({ targetRole, targetDepartment }) {
  return db.user.findMany({
    where: {
      AND: [
        targetRole ? { role: { name: targetRole } } : {},
        targetDepartment ? { departmentId: targetDepartment } : {},
      ],
    },
    select: { id: true },
  });
}

// only shows notices meant for this user's role/department, or ones with no targeting (everyone)
async function getNoticesForUser(user) {
  return db.notice.findMany({
    where: {
      AND: [
        { OR: [{ targetRole: null }, { targetRole: user.role.name }] },
        { OR: [{ targetDepartment: null }, { targetDepartment: user.departmentId }] },
      ],
    },
    include: { creator: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function deleteNotice(noticeId) {
  await db.notice.delete({ where: { id: noticeId } });
}

module.exports = { createNotice, getNoticesForUser, deleteNotice, getUsersMatchingNoticeTarget };
