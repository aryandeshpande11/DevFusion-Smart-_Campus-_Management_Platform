const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

const router = express.Router();

router.use(requireAuth, requireRole(['admin', 'coordinator']));

router.get('/overview', analyticsController.getOverview);
router.get('/attendance', analyticsController.getAttendanceStats);
router.get('/placements', analyticsController.getPlacementStats);
router.get('/events', analyticsController.getEventStats);

module.exports = router;