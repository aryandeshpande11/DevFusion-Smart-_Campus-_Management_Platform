const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const validateBody = require('../middlewares/validate');
const {
  createSessionSchema,
  markAttendanceSchema,
  scanAttendanceSchema,
} = require('../validators/attendanceValidator');

const router = express.Router();

router.use(requireAuth);

router.post('/sessions', requireRole(['faculty']), validateBody(createSessionSchema), attendanceController.createSession);
router.get('/sessions/:courseId', attendanceController.getSessionsForCourse);
router.post('/sessions/:id/mark', requireRole(['faculty']), validateBody(markAttendanceSchema), attendanceController.markManually);
router.post('/sessions/:id/scan', requireRole(['student']), validateBody(scanAttendanceSchema), attendanceController.markByScan);

router.get('/me/history', requireRole(['student']), attendanceController.getMyHistory);
router.get('/me/summary', requireRole(['student']), attendanceController.getMySummary);

router.get('/reports/:courseId', requireRole(['faculty', 'admin', 'coordinator']), attendanceController.getCourseReport);

module.exports = router;