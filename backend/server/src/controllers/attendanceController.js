const attendanceService = require('../services/attendanceService');
const { sendSuccess } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { emitAttendanceUpdate } = require('../sockets/socketHandlers');

const createSession = catchAsync(async function handleCreateSession(req, res) {
  const session = await attendanceService.createAttendanceSession(req.currentUser.id, req.body);
  return sendSuccess(res, 201, 'Attendance session started', { session });
});

const getSessionsForCourse = catchAsync(async function handleGetSessionsForCourse(req, res) {
  const sessions = await attendanceService.getSessionsForCourse(req.params.courseId);
  return sendSuccess(res, 200, 'Sessions fetched', { sessions });
});

const markManually = catchAsync(async function handleMarkManually(req, res) {
  const record = await attendanceService.markAttendanceManually(
      req.currentUser.id,
      req.params.id,
      req.body.studentId,
      req.body.status
  );
  const io = req.app.get('io');
  emitAttendanceUpdate(io, req.params.id, record);
  return sendSuccess(res, 200, 'Attendance marked', { record });
});

const markByScan = catchAsync(async function handleMarkByScan(req, res) {
  const record = await attendanceService.markAttendanceByQrScan(req.currentUser.id, req.body.qrToken);
  const io = req.app.get('io');
  emitAttendanceUpdate(io, record.sessionId, record);
  return sendSuccess(res, 200, 'You have been marked present', { record });
});

const getMyHistory = catchAsync(async function handleGetMyHistory(req, res) {
  const history = await attendanceService.getStudentAttendanceHistory(req.currentUser.id);
  return sendSuccess(res, 200, 'Attendance history fetched', { history });
});

const getMySummary = catchAsync(async function handleGetMySummary(req, res) {
  const summary = await attendanceService.getStudentAttendanceSummary(req.currentUser.id);
  return sendSuccess(res, 200, 'Attendance summary fetched', { summary });
});

const getCourseReport = catchAsync(async function handleGetCourseReport(req, res) {
  const report = await attendanceService.getCourseAttendanceReport(req.params.courseId);
  return sendSuccess(res, 200, 'Report fetched', { report });
});

const getMonthlyReport = catchAsync(async function handleGetMonthlyReport(req, res) {
  const report = await attendanceService.getMonthlyAttendanceReport();
  return sendSuccess(res, 200, 'Monthly report fetched', { report });
});

module.exports = {
  createSession,
  getSessionsForCourse,
  markManually,
  markByScan,
  getMyHistory,
  getMySummary,
  getCourseReport,
  getMonthlyReport,
};