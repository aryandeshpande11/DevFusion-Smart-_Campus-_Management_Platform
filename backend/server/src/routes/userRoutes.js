const express = require('express');
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const upload = require('../middlewares/upload');
const { uploadRateLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

router.use(requireAuth);

// self-service profile routes
router.get('/me', userController.getMyProfile);
router.patch('/me', userController.updateMyProfile);
router.post('/me/avatar', uploadRateLimiter, upload.single('avatar'), userController.uploadMyAvatar);
router.post('/me/resume', uploadRateLimiter, upload.single('resume'), userController.uploadMyResume);

// admin/faculty management routes
router.get('/', requireRole(['admin']), userController.listUsers);
router.get('/:id', requireRole(['admin', 'faculty']), userController.getUserById);
router.patch('/:id/role', requireRole(['admin']), userController.updateUserRole);
router.patch('/:id/status', requireRole(['admin']), userController.updateUserStatus);
router.delete('/:id', requireRole(['admin']), userController.deleteUser);

module.exports = router;
