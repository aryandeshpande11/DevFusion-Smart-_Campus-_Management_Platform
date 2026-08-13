const express = require('express');
const notificationController = require('../controllers/notificationController');
const requireAuth = require('../middlewares/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
