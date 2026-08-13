const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

const router = express.Router();

router.use(requireAuth, requireRole(['admin']));

router.get('/logs', analyticsController.getActivityLogs);
router.get('/export/:entity', analyticsController.exportEntityData);

module.exports = router;
