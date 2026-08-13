// business logic for the admin-only activity log feed and data export
const db = require('../config/db');
const AppError = require('../utils/appError');

async function getActivityLogs(page = 1, pageSize = 25) {
  const skip = (page - 1) * pageSize;

  const [logs, totalCount] = await Promise.all([
    db.activityLog.findMany({
      include: { actor: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    db.activityLog.count(),
  ]);

  return { logs, totalCount, page, pageSize };
}

// logged by other services whenever an admin does something sensitive (role change, delete, etc)
async function recordActivityLog(actorId, action, entityType, entityId, metadata = {}) {
  return db.activityLog.create({ data: { actorId, action, entityType, entityId, metadata } });
}

// pulls raw rows for a given entity so the controller can convert them to csv
async function getEntityDataForExport(entityName) {
  const entityMap = {
    users: () => db.user.findMany({ include: { role: true, department: true } }),
    events: () => db.event.findMany(),
    attendance: () => db.attendanceRecord.findMany({ include: { student: true, session: true } }),
    placements: () => db.placement.findMany(),
  };

  const fetcher = entityMap[entityName];
  if (!fetcher) throw new AppError('Unknown entity for export', 400);

  return fetcher();
}

module.exports = { getActivityLogs, recordActivityLog, getEntityDataForExport };
