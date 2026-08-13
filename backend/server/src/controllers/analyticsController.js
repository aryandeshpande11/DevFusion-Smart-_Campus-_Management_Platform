const analyticsService = require('../services/analyticsService');
const adminService = require('../services/adminService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { convertToCsv } = require('../utils/csvExporter');

const getOverview = catchAsync(async function handleGetOverview(req, res) {
  const overview = await analyticsService.getOverviewStats();
  return sendSuccess(res, 200, 'Overview fetched', { overview });
});

const getAttendanceStats = catchAsync(async function handleGetAttendanceStats(req, res) {
  const stats = await analyticsService.getAttendanceStats();
  return sendSuccess(res, 200, 'Attendance stats fetched', { stats });
});

const getPlacementStats = catchAsync(async function handleGetPlacementStats(req, res) {
  const stats = await analyticsService.getPlacementStats();
  return sendSuccess(res, 200, 'Placement stats fetched', { stats });
});

const getEventStats = catchAsync(async function handleGetEventStats(req, res) {
  const stats = await analyticsService.getEventStats();
  return sendSuccess(res, 200, 'Event stats fetched', { stats });
});

const getActivityLogs = catchAsync(async function handleGetActivityLogs(req, res) {
  const page = Number(req.query.page) || 1;
  const logs = await adminService.getActivityLogs(page);
  return sendSuccess(res, 200, 'Logs fetched', logs);
});

// streams a csv file back for the requested entity (users, events, attendance, placements)
const exportEntityData = catchAsync(async function handleExportEntityData(req, res) {
  const rows = await adminService.getEntityDataForExport(req.params.entity);
  const csv = convertToCsv(rows);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.entity}.csv`);
  res.send(csv);
});

module.exports = {
  getOverview,
  getAttendanceStats,
  getPlacementStats,
  getEventStats,
  getActivityLogs,
  exportEntityData,
};
